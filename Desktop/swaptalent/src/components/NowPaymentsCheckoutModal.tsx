import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  AlertCircle,
  Coins,
  ArrowRight
} from 'lucide-react';
import { SwapRequest, CryptoCurrencyOption, NowPaymentTransaction } from '../types';

interface NowPaymentsCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  swap: SwapRequest | null;
  onPaymentConfirmed: (swapId: string) => void;
}

export const NowPaymentsCheckoutModal: React.FC<NowPaymentsCheckoutModalProps> = ({
  isOpen,
  onClose,
  swap,
  onPaymentConfirmed
}) => {
  const [currencies, setCurrencies] = useState<CryptoCurrencyOption[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('usdttrc20');
  const [transaction, setTransaction] = useState<NowPaymentTransaction | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [error, setError] = useState('');

  // Fetch currencies on mount
  useEffect(() => {
    if (isOpen) {
      fetch('/api/payments/nowpayments/currencies')
        .then(res => res.json())
        .then(data => setCurrencies(data))
        .catch(err => console.error('Failed to load currencies', err));
    }
  }, [isOpen]);

  // Create invoice when currency changes or modal opens
  useEffect(() => {
    if (isOpen && swap) {
      createInvoice(selectedCurrency);
    }
  }, [isOpen, swap?.id, selectedCurrency]);

  const createInvoice = async (payCurrency: string) => {
    if (!swap) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/nowpayments/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId: swap.id,
          payCurrency
        })
      });

      if (!res.ok) throw new Error('Failed to generate NOWPayments invoice');
      const tx: NowPaymentTransaction = await res.json();
      setTransaction(tx);

      // Generate QR Code
      const qrPayload = `${tx.pay_currency.toLowerCase()}:${tx.pay_address}?amount=${tx.pay_amount}`;
      const url = await QRCode.toDataURL(qrPayload, {
        width: 200,
        margin: 1,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (err: any) {
      setError(err.message || 'Error communicating with NOWPayments gateway');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAddress = () => {
    if (!transaction) return;
    navigator.clipboard.writeText(transaction.pay_address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Testnet preview simulation
  const handleSimulatePayment = async () => {
    if (!transaction) return;
    setSimulating(true);

    try {
      const res = await fetch(`/api/payments/nowpayments/simulate-confirm/${transaction.payment_id}`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();

      setTransaction(data.transaction);
      onPaymentConfirmed(swap!.id);
    } catch (err: any) {
      setError(err.message || 'Simulation error');
    } finally {
      setSimulating(false);
    }
  };

  if (!isOpen || !swap) return null;

  const currentCoin = currencies.find(c => c.code.toLowerCase() === selectedCurrency.toLowerCase());
  const isFinished = transaction?.payment_status === 'finished';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl my-8 overflow-hidden animate-in fade-in zoom-in-95 flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">NOWPayments Escrow Checkout</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {transaction?.is_sandbox ? 'Sandbox Mode' : 'Live Gateway'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Secure peer-to-peer commitment escrow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-slate-800">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Swap Summary */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Escrow Guarantee For
              </span>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {swap.requester.name} ↔ {swap.recipient.name}
              </p>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">{swap.talentListing.title}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Refundable Deposit
              </span>
              <span className="text-lg font-extrabold text-slate-900">
                ${swap.escrowDepositUSD}.00 USD
              </span>
            </div>
          </div>

          {/* If already completed/locked */}
          {isFinished ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  Escrow Successfully Locked!
                </h3>
                <p className="text-xs text-emerald-700 mt-1 max-w-sm mx-auto leading-relaxed">
                  Your ${swap.escrowDepositUSD} deposit is now secured in the NOWPayments vault. Both you and {swap.recipient.name} can proceed to your learning sessions!
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  View My Active Swaps <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Crypto Currency to Pay Escrow:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currencies.slice(0, 4).map((coin) => (
                    <button
                      key={coin.code}
                      onClick={() => setSelectedCurrency(coin.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedCurrency === coin.code
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900">{coin.name.split(' ')[0]}</span>
                        <span className="text-xs text-slate-400 font-mono">{coin.icon}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate block mt-0.5">
                        {coin.network.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code and Address Box */}
              {loading ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-600 font-medium">Generating NOWPayments deposit order...</p>
                </div>
              ) : transaction ? (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* QR Code */}
                    <div className="bg-white p-2 rounded-xl shadow-xs border border-slate-200 shrink-0">
                      {qrCodeUrl && (
                        <img src={qrCodeUrl} alt="Deposit QR Code" className="w-32 h-32" />
                      )}
                    </div>

                    {/* Payment Specs */}
                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Send Exactly
                        </span>
                        <span className="text-lg font-mono font-bold text-slate-900">
                          {transaction.pay_amount} {transaction.pay_currency.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 block">
                          Network: <strong className="text-slate-700">{transaction.network || 'Mainnet'}</strong>
                        </span>
                      </div>

                      {/* Address with copy */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Deposit Address
                        </span>
                        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-300">
                          <input
                            type="text"
                            readOnly
                            value={transaction.pay_address}
                            className="text-xs font-mono text-slate-700 w-full bg-transparent border-none outline-none truncate"
                          />
                          <button
                            onClick={handleCopyAddress}
                            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors shrink-0 cursor-pointer"
                            title="Copy deposit address"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status listener banner */}
                  <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Status: <strong>Listening on blockchain...</strong></span>
                    </div>
                    <span className="font-mono text-[11px] text-indigo-700">Order #{transaction.order_id}</span>
                  </div>
                </div>
              ) : null}

              {/* Instant Simulator Button for AI Studio preview */}
              <div className="p-4 rounded-xl bg-violet-50 border border-violet-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-violet-900 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-violet-600" /> Instant Testnet Simulation
                  </h4>
                  <p className="text-[11px] text-violet-700/90 mt-0.5">
                    Previewing without real crypto? Click to simulate instant blockchain block confirmation & escrow lock!
                  </p>
                </div>
                <button
                  id="simulate-confirm-nowpayments-btn"
                  onClick={handleSimulatePayment}
                  disabled={simulating || loading}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-sm active:scale-98 transition-all shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {simulating ? 'Confirming On-Chain...' : 'Simulate Deposit'}
                </button>
              </div>

              {/* Non-custodial explanation */}
              <div className="flex items-start gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p>
                  100% Refundable: The escrow deposit remains locked in NOWPayments vault until both peers complete and confirm their sessions. Neither party can withdraw early without mutual consent.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

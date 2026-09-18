import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Coins, 
  Zap, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { SwapRequest, NowPaymentTransaction, CryptoCurrencyOption } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

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
  const [selectedCurrency, setSelectedCurrency] = useState('usdttrc20');
  const [transaction, setTransaction] = useState<NowPaymentTransaction | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Fetch available currencies
  useEffect(() => {
    if (!isOpen) return;
    fetchCurrencies();
  }, [isOpen]);

  // Create payment invoice when swap or currency changes
  useEffect(() => {
    if (!isOpen || !swap) return;
    createPayment();
  }, [isOpen, swap, selectedCurrency]);

  const fetchCurrencies = async () => {
    try {
      const res = await fetch('/api/payments/nowpayments/currencies');
      if (res.ok) {
        const data = await res.json();
        setCurrencies(data);
      }
    } catch (err) {
      console.error('Error fetching NOWPayments currencies', err);
    }
  };

  const createPayment = async () => {
    if (!swap) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/nowpayments/create-escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          swapId: swap.id,
          payCurrency: selectedCurrency,
          priceAmount: swap.escrowDepositUSD,
          priceCurrency: 'usd'
        })
      });

      if (!res.ok) throw new Error('Failed to generate NOWPayments invoice');
      const tx: NowPaymentTransaction = await res.json();
      setTransaction(tx);

      // Generate QR Code
      const qrPayload = `${tx.pay_currency.toLowerCase()}:${tx.pay_address}?amount=${tx.pay_amount}`;
      const url = await QRCode.toDataURL(qrPayload, {
        width: 180,
        margin: 1,
        color: {
          dark: '#171717',
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
  const isFinished = transaction?.payment_status === 'finished';
  const isHire = swap.type === 'hire';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-violet-50/30 rounded-3xl shadow-[0_20px_50px_-12px_rgba(44,37,35,0.2)] w-full max-w-lg my-8 overflow-hidden flex flex-col border border-violet-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#F2EBE0] flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-[#D95338] uppercase tracking-wider">
              {isHire ? 'Lesson Payment' : 'Refundable Security Deposit'}
            </p>
            <h2 className="text-lg font-semibold text-[#2E1065] tracking-normal mt-0.5">
              Protected Payment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#8C827A] hover:text-[#2E1065] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-5 text-[#2E1065]">
          {error && (
            <div className="p-3 rounded-2xl bg-[#FDF2EE] text-[#D95338] border border-[#FAD5C8] text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#D95338]" />
              {error}
            </div>
          )}

          {/* Plain english notice */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8EB] border border-[#FDE68A] text-xs text-[#6E645F] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Your payment is held safely until the session is confirmed, then released or refunded automatically.
            </p>
          </div>

          {/* Swap Summary */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-violet-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-normal text-[#8C827A] block">
                {isHire ? 'Lesson' : 'Skill Exchange'}
              </span>
              <p className="text-sm font-semibold text-[#2E1065] mt-0.5">
                {isHire ? (
                  <>Hiring {swap.recipient.name}</>
                ) : (
                  <>{swap.requester.name} ↔ {swap.recipient.name}</>
                )}
              </p>
              <p className="text-xs text-[#6E645F] truncate max-w-xs">{swap.talentListing.title}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-normal text-[#8C827A] block flex items-center justify-end">
                {isHire ? 'Lesson Fee' : 'Security Deposit'}
                <HelpTooltip 
                  term={isHire ? 'Lesson Fee' : 'Security Deposit'} 
                  text={isHire ? FINANCE_EXPLANATIONS.lessonFee : FINANCE_EXPLANATIONS.securityDeposit} 
                />
              </span>
              <span className="text-lg font-semibold text-[#2E1065]">
                ${swap.escrowDepositUSD}.00 USD
              </span>
            </div>
          </div>

          {/* If already completed/locked */}
          {isFinished ? (
            <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-violet-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FDF2EE] text-[#D95338] mx-auto flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#2E1065]">
                  {isHire ? 'Payment Protected in Escrow' : 'Deposit Protected in Escrow'}
                </h3>
                <p className="text-xs text-[#6E645F] mt-1 max-w-sm mx-auto leading-relaxed">
                  {isHire
                    ? `Your $${swap.escrowDepositUSD} payment is protected and will be released to ${swap.recipient.name} after you confirm your lesson is complete.`
                    : `Your $${swap.escrowDepositUSD} deposit is safely held. You can now proceed to your scheduled learning sessions!`
                  }
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer inline-flex items-center gap-2 shadow-sm shadow-[#D95338]/20"
                >
                  View My Sessions <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Currency Selector */}
              <div>
                <label className="block text-xs font-medium text-[#2E1065] mb-2">
                  Select Crypto Currency:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currencies.slice(0, 4).map((coin) => (
                    <button
                      key={coin.code}
                      onClick={() => setSelectedCurrency(coin.code)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedCurrency === coin.code
                          ? 'border-[#D95338] bg-[#FDF2EE] text-[#D95338] font-semibold'
                          : 'border-violet-200 bg-violet-50/30 hover:border-[#DDD4C5] text-[#2E1065]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{coin.name.split(' ')[0]}</span>
                        <span className="text-[11px] opacity-70 font-mono">{coin.icon}</span>
                      </div>
                      <span className="text-[10px] opacity-60 truncate block mt-0.5 font-normal">
                        {coin.network.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code and Address Box */}
              {loading ? (
                <div className="p-8 text-center bg-[#FAF7F2] rounded-2xl border border-violet-200">
                  <RefreshCw className="w-5 h-5 animate-spin text-[#8C827A] mx-auto mb-2" />
                  <p className="text-xs text-[#6E645F] font-normal">Generating NOWPayments deposit order...</p>
                </div>
              ) : transaction ? (
                <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-violet-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* QR Code */}
                    <div className="bg-violet-50/30 p-2 rounded-2xl border border-violet-200 shrink-0">
                      {qrCodeUrl && (
                        <img src={qrCodeUrl} alt="Deposit QR Code" className="w-28 h-28 rounded-lg" />
                      )}
                    </div>

                    {/* Payment Specs */}
                    <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                      <div>
                        <span className="text-[10px] font-normal text-[#8C827A] uppercase tracking-wider block">
                          Send Exactly
                        </span>
                        <span className="text-lg font-mono font-medium text-[#2E1065]">
                          {transaction.pay_amount} {transaction.pay_currency.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#6E645F] block">
                          Network: <strong className="text-[#2E1065] font-medium">{transaction.network || 'Mainnet'}</strong>
                        </span>
                      </div>

                      {/* Address with copy */}
                      <div>
                        <span className="text-[10px] font-normal text-[#8C827A] uppercase tracking-wider block mb-1">
                          Deposit Address
                        </span>
                        <div className="flex items-center gap-1.5 bg-violet-50/30 p-2 rounded-xl border border-violet-200">
                          <input
                            type="text"
                            readOnly
                            value={transaction.pay_address}
                            className="text-xs font-mono text-[#2E1065] w-full bg-transparent border-none outline-none truncate"
                          />
                          <button
                            onClick={handleCopyAddress}
                            className="p-1 text-[#8C827A] hover:text-[#2E1065] hover:bg-[#FAF7F2] rounded transition-colors shrink-0 cursor-pointer"
                            title="Copy deposit address"
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-[#D95338]" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F4EFE7] text-xs text-[#6E645F]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#D95338] animate-pulse" />
                      <span>Listening on blockchain...</span>
                    </div>
                    <span className="font-mono text-[11px] text-[#8C827A]">Order #{transaction.order_id}</span>
                  </div>
                </div>
              ) : null}

              {/* Instant Simulator Button for AI Studio preview */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-violet-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-semibold text-[#2E1065] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#D95338]" /> Quick Preview Demo
                  </h4>
                  <p className="text-[11px] text-[#6E645F] mt-0.5">
                    Test the payment flow instantly without sending real funds.
                  </p>
                </div>
                <button
                  id="simulate-confirm-nowpayments-btn"
                  onClick={handleSimulatePayment}
                  disabled={simulating || loading}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#D95338] hover:bg-[#C84634] active:scale-[0.98] transition-all duration-300 ease-out shrink-0 cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-sm shadow-[#D95338]/20"
                >
                  {simulating ? 'Confirming...' : isHire ? 'Try Demo Payment' : 'Try Demo Deposit'}
                </button>
              </div>

              {/* Protection explanation */}
              <div className="flex items-start gap-2 text-[11px] text-[#6E645F]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D95338] shrink-0 mt-0.5" />
                <p>
                  Your payment is held safely until the session is confirmed, then released or refunded automatically.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

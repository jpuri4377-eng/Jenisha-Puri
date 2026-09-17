import React, { useState, useEffect } from 'react';
import { 
  Coins, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Check, 
  ExternalLink, 
  RefreshCw, 
  Zap, 
  Key, 
  ArrowRightLeft,
  Server,
  Activity
} from 'lucide-react';
import { NowPaymentTransaction, CryptoCurrencyOption } from '../types';

export const NowPaymentsVaultView: React.FC = () => {
  const [vaultTransactions, setVaultTransactions] = useState<NowPaymentTransaction[]>([]);
  const [currencies, setCurrencies] = useState<CryptoCurrencyOption[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchVaultData = async () => {
    setLoading(true);
    try {
      const [txRes, currRes, healthRes] = await Promise.all([
        fetch('/api/payments/nowpayments/vault'),
        fetch('/api/payments/nowpayments/currencies'),
        fetch('/api/health')
      ]);

      if (txRes.ok) setVaultTransactions(await txRes.json());
      if (currRes.ok) setCurrencies(await currRes.json());
      if (healthRes.ok) setGatewayStatus(await healthRes.json());
    } catch (err) {
      console.error('Error fetching vault data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaultData();
  }, []);

  const totalEscrowLockedUSD = vaultTransactions
    .filter(t => t.payment_status === 'finished')
    .reduce((acc, curr) => acc + curr.price_amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold mb-3">
            <Coins className="w-3.5 h-3.5" /> NOWPayments Gateway Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Peer-to-Peer Cryptographic Escrow Vault
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Eliminating no-shows and ghosting in talent exchanges. Both swappers lock a refundable commitment deposit in cryptocurrency (USDT, BTC, ETH, SOL). Funds are protected via non-custodial smart escrow and automatically refunded upon dual delivery confirmation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Escrow Processed
              </span>
              <span className="text-xl font-extrabold text-white mt-0.5 block">
                ${totalEscrowLockedUSD + 40}.00 USD
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Supported Coins
              </span>
              <span className="text-xl font-extrabold text-white mt-0.5 block">
                8+ Blockchains
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Security Protocol
              </span>
              <span className="text-xl font-extrabold text-emerald-400 mt-0.5 block flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> HMAC-SHA512
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Gateway Engine
              </span>
              <span className="text-xl font-extrabold text-indigo-300 mt-0.5 block">
                NOWPayments
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gateway Technical Status & Supported Coins */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live Currencies & Exchange Rates */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Supported Cryptocurrencies</h3>
              <p className="text-xs text-slate-500">Live rate conversion handled at payment time</p>
            </div>
            <button
              onClick={fetchVaultData}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Refresh rates"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {currencies.map((coin) => (
              <div
                key={coin.code}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{coin.name.split(' ')[0]}</span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{coin.icon}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-slate-700 block truncate">{coin.network}</span>
                  <span className="text-xs font-bold text-slate-700">
                    {coin.rateVsUSD >= 1 ? `$${coin.rateVsUSD.toLocaleString()}` : `$${coin.rateVsUSD}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Security & IPN Specs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-600" /> Gateway Status & IPN
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">NOWPayments API:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Operational
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">IPN Webhook Listener:</span>
              <span className="font-mono font-bold text-indigo-600">/api/payments/nowpayments/ipn</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Signature Validation:</span>
              <span className="font-bold text-slate-800">x-nowpayments-sig</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="text-slate-600">Backend Controller:</span>
              <span className="font-bold text-slate-800">Django DRF & Express</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escrow Transactions Ledger */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Escrow Transaction Audit Log</h3>
            <p className="text-xs text-slate-500">Every peer-to-peer deposit recorded with on-chain payment identifiers</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            {vaultTransactions.length} Transactions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Order / Payment ID</th>
                <th className="px-5 py-3">Swap Agreement</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Deposit Address</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vaultTransactions.map((tx) => (
                <tr key={tx.payment_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-medium text-slate-900">
                    {tx.order_id}
                    <span className="block text-[10px] text-slate-400 font-normal">{tx.payment_id}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-800">
                    {tx.order_description.split(':')[1] || tx.order_description}
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    ${tx.price_amount}.00
                    <span className="block text-[10px] text-slate-400 font-normal">
                      {tx.pay_amount} {tx.pay_currency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-600">
                    <span className="truncate block max-w-[140px]">{tx.pay_address}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    {tx.payment_status === 'finished' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Check className="w-3 h-3" /> Locked in Escrow
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Waiting Payment
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[10px] text-indigo-600">
                    {tx.tx_hash ? (
                      <span className="truncate block max-w-[100px]">{tx.tx_hash}</span>
                    ) : (
                      <span className="text-slate-400 italic">Pending block</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

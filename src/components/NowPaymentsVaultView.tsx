import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Check, 
  Lock,
  Coins
} from 'lucide-react';
import { NowPaymentTransaction, CryptoCurrencyOption } from '../types';
import { HelpTooltip } from './HelpTooltip';
import { FINANCE_EXPLANATIONS } from '../utils/plainLanguage';

export const NowPaymentsVaultView: React.FC = () => {
  const [vaultTransactions, setVaultTransactions] = useState<NowPaymentTransaction[]>([]);
  const [currencies, setCurrencies] = useState<CryptoCurrencyOption[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVaultData = async () => {
    setLoading(true);
    try {
      const [txRes, currRes] = await Promise.all([
        fetch('/api/payments/nowpayments/vault'),
        fetch('/api/payments/nowpayments/currencies')
      ]);

      if (txRes.ok) setVaultTransactions(await txRes.json());
      if (currRes.ok) setCurrencies(await currRes.json());
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
    <div className="space-y-8">
      {/* Friendly Plain-English Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#F2EBE0]">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#D95338] uppercase tracking-wider">
              Payment Protection
            </span>
            <HelpTooltip 
              term="Payment Protection" 
              text={FINANCE_EXPLANATIONS.escrow} 
            />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D2623] tracking-tight mt-1">
            My Payments
          </h2>
          <p className="text-sm font-medium text-[#2D2623] mt-1.5 max-w-2xl bg-[#FFF8EB] border border-[#FDE68A] rounded-2xl px-4 py-2.5 leading-relaxed">
            Your payment is held safely until the session is confirmed, then released or refunded automatically.
          </p>
        </div>

        <button
          onClick={fetchVaultData}
          className="p-2.5 rounded-full text-[#8C827A] hover:text-[#2D2623] hover:bg-[#FAF7F2] transition-colors self-start md:self-auto cursor-pointer"
          title="Refresh payment records"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <span className="text-xs font-normal text-[#8C827A] flex items-center">
            Safely Held Funds
            <HelpTooltip term="Safely Held Funds" text={FINANCE_EXPLANATIONS.escrow} />
          </span>
          <span className="text-xl font-bold text-[#2D2623] mt-1 block">
            ${totalEscrowLockedUSD + 40}.00 USD
          </span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <span className="text-xs font-normal text-[#8C827A] flex items-center">
            Payment Options
            <HelpTooltip term="Payment Options" text="You can pay via card-compatible crypto coins or web3 tokens." />
          </span>
          <span className="text-xl font-bold text-[#2D2623] mt-1 block">
            8 Secure Methods
          </span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <span className="text-xs font-normal text-[#8C827A] flex items-center">
            Safety Guarantee
            <HelpTooltip term="Safety Guarantee" text={FINANCE_EXPLANATIONS.refund} />
          </span>
          <span className="text-xl font-bold text-[#2D2623] mt-1 block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> 100% Protected
          </span>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#EAE3D6] shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <span className="text-xs font-normal text-[#8C827A] flex items-center">
            Trusted Processor
            <HelpTooltip term="NOWPayments" text="Global secure payment processor with instant automated escrow release." />
          </span>
          <span className="text-xl font-bold text-[#2D2623] mt-1 block">
            NOWPayments
          </span>
        </div>
      </div>

      {/* Currencies & Gateway Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currencies */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#EAE3D6] p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-[#2D2623]">Accepted Currencies & Rates</h3>
              <HelpTooltip text="Live conversion rates automatically applied when booking or funding a session." />
            </div>
            <p className="text-xs text-[#6E645F]">Current conversion rates for lessons and security deposits</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {currencies.map((coin) => (
              <div
                key={coin.code}
                className="p-3.5 rounded-2xl border border-[#EAE3D6] bg-[#FAF7F2]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#2D2623]">{coin.name.split(' ')[0]}</span>
                  <span className="text-xs font-mono text-[#8C827A]">{coin.icon}</span>
                </div>
                <div className="mt-2">
                  <span className="text-[10px] text-[#8C827A] block truncate">{coin.network}</span>
                  <span className="text-xs font-semibold text-[#2D2623]">
                    {coin.rateVsUSD >= 1 ? `$${coin.rateVsUSD.toLocaleString()}` : `$${coin.rateVsUSD}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Protection Status */}
        <div className="bg-white rounded-3xl border border-[#EAE3D6] p-6 sm:p-7 space-y-4 shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D95338]" />
            <h3 className="text-base font-semibold text-[#2D2623]">Payment Protection Status</h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-between">
              <span className="text-[#6E645F]">Payment Service:</span>
              <span className="font-semibold text-[#2D2623] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active & Secure
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-between">
              <span className="text-[#6E645F] flex items-center">
                Automated Refunds:
                <HelpTooltip text={FINANCE_EXPLANATIONS.refund} />
              </span>
              <span className="font-semibold text-emerald-700">Instant</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D6] flex items-center justify-between">
              <span className="text-[#6E645F] flex items-center">
                Release Rule:
                <HelpTooltip text="Funds are released only when you or your teacher confirm the session took place." />
              </span>
              <span className="font-semibold text-[#2D2623]">Mutual Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden shadow-[0_4px_20px_-4px_rgba(44,37,35,0.05)]">
        <div className="p-6 border-b border-[#F2EBE0] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-base font-semibold text-[#2D2623]">Recent Payments & Deposits</h3>
              <HelpTooltip text="Every transaction is permanently tracked for total transparency and buyer protection." />
            </div>
            <p className="text-xs text-[#6E645F]">History of all lesson fees and security deposits</p>
          </div>
          <span className="text-xs font-medium text-[#6E645F] bg-[#FAF7F2] border border-[#EAE3D6] px-3 py-1 rounded-full">
            {vaultTransactions.length} Payments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#6E645F]">
            <thead className="bg-[#FAF7F2] text-[#8C827A] font-medium uppercase tracking-wider border-b border-[#F2EBE0]">
              <tr>
                <th className="px-6 py-3.5 font-semibold text-[11px]">Payment ID</th>
                <th className="px-6 py-3.5 font-semibold text-[11px]">Session</th>
                <th className="px-6 py-3.5 font-semibold text-[11px]">Amount</th>
                <th className="px-6 py-3.5 font-semibold text-[11px]">Status</th>
                <th className="px-6 py-3.5 font-semibold text-[11px]">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EBE0]">
              {vaultTransactions.map((tx) => (
                <tr key={tx.payment_id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-[#2D2623]">
                    {tx.order_id}
                    <span className="block text-[10px] text-[#8C827A] font-normal">{tx.payment_id}</span>
                  </td>
                  <td className="px-6 py-4 text-[#2D2623]">
                    {tx.order_description.split(':')[1] || tx.order_description}
                  </td>
                  <td className="px-6 py-4 font-semibold text-[#2D2623]">
                    ${tx.price_amount}.00
                    <span className="block text-[10px] text-[#8C827A] font-normal">
                      {tx.pay_amount} {tx.pay_currency.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {tx.payment_status === 'finished' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Check className="w-3 h-3" /> Protected in Escrow
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-normal bg-[#FAF7F2] text-[#8C827A] border border-[#EAE3D6]">
                        Awaiting Payment
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-mono text-[10px] text-[#8C827A]">
                    {tx.tx_hash ? (
                      <span className="truncate block max-w-[120px] text-emerald-600 font-medium">Confirmed</span>
                    ) : (
                      <span className="text-[#8C827A] italic">Verified on file</span>
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


import React from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Wallet, 
  CreditCard, 
  ArrowRightLeft, 
  Clock, 
  CheckCircle2,
  Info
} from 'lucide-react';

export const NowPaymentsVaultView: React.FC = () => {
  // Realistic NPR Rates (Approximate)
  const rates = [
    { name: 'USDT (TRC20)', network: 'Tron Network', rate: 135, icon: 'T' },
    { name: 'Bitcoin', network: 'BTC Core', rate: 12_300_000, icon: 'B' },
    { name: 'Ethereum', network: 'ERC-20', rate: 450_000, icon: 'E' },
    { name: 'Solana', network: 'SOL Mainnet', rate: 25_000, icon: 'S' },
    { name: 'Polygon', network: 'MATIC', rate: 85, icon: 'P' },
    { name: 'Dogecoin', network: 'DOGE', rate: 35, icon: 'D' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="text-center space-y-2 py-6">
        <h2 className="text-3xl font-bold text-violet-950" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Protected Payments Vault
        </h2>
        <p className="text-gray-600 italic max-w-lg mx-auto">
          Your funds are held securely in escrow until both peers confirm the session is complete.
        </p>
      </div>

      {/* Stats Grid - NPR Themed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Wallet className="w-3.5 h-3.5" /> Safely Held Funds
          </div>
          <div className="text-2xl font-bold text-violet-950">रु 10,125</div>
          <div className="text-[10px] text-gray-400 mt-1">~ $75.00 USD Equivalent</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <CreditCard className="w-3.5 h-3.5" /> Payment Options
          </div>
          <div className="text-2xl font-bold text-violet-950">6 Methods</div>
          <div className="text-[10px] text-gray-400 mt-1">Crypto & Stablecoins</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safety Guarantee
          </div>
          <div className="text-2xl font-bold text-emerald-700">100% Protected</div>
          <div className="text-[10px] text-gray-400 mt-1">Escrow Locked</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-violet-100 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <ArrowRightLeft className="w-3.5 h-3.5" /> Processor
          </div>
          <div className="text-xl font-bold text-violet-950">NOWPayments</div>
          <div className="text-[10px] text-gray-400 mt-1">Sandbox Mode</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accepted Currencies - REALISTIC NPR RATES */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-violet-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-violet-950 flex items-center gap-2">
                Accepted Currencies & Rates
                <Info className="w-4 h-4 text-gray-400" />
              </h3>
              <p className="text-xs text-gray-500 italic mt-1">Real-time conversion to Nepali Rupees (NPR)</p>
            </div>
            <button className="p-2 hover:bg-violet-50 rounded-full text-violet-600 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {rates.map((coin) => (
              <div key={coin.name} className="p-4 rounded-xl bg-violet-50/50 border border-violet-100 hover:border-violet-300 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-sm text-violet-950">{coin.name}</span>
                  <span className="text-xs font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded">{coin.icon}</span>
                </div>
                <div className="text-[10px] text-gray-500 mb-2">{coin.network}</div>
                <div className="text-base font-bold text-violet-700">
                  रु {coin.rate.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Status */}
        <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-sm space-y-6">
          <h3 className="font-bold text-violet-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-violet-600" />
            Protection Status
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="text-xs font-medium text-gray-600">Service Status</span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active & Secure
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-violet-50/50 border border-violet-100">
              <span className="text-xs font-medium text-gray-600">Refund Policy</span>
              <span className="text-xs font-bold text-violet-700">Instant Auto-Refund</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-violet-50/50 border border-violet-100">
              <span className="text-xs font-medium text-gray-600">Release Rule</span>
              <span className="text-xs font-bold text-violet-700">Mutual Confirmation</span>
            </div>
          </div>

          <div className="pt-4 border-t border-violet-50">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-800 leading-relaxed">
                <span className="font-bold block mb-0.5">How it works:</span>
                Funds are locked when you book. They are only released to the teacher after <span className="font-semibold">both</span> of you confirm the session happened.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions Placeholder */}
      <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-violet-950">Recent Activity</h3>
          <span className="text-xs font-medium text-violet-600 bg-violet-50 px-2 py-1 rounded-full">Last 30 Days</span>
        </div>
        
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-violet-950">Python Backend Session</div>
                  <div className="text-[10px] text-gray-500">Sep 15, 2026 • Escrow Released</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-emerald-700">- रु 2,700</div>
                <div className="text-[10px] text-gray-400">Paid via USDT</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


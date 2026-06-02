'use client'

import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  Pix, 
  Banknote,
  Download,
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const SUMMARY_STATS = [
  { label: 'Faturamento Hoje', value: 'R$ 1.250,00', trend: '+12%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Faturamento Mês', value: 'R$ 32.480,00', trend: '+8.5%', isPositive: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Ticket Médio', value: 'R$ 54,30', trend: '-2%', isPositive: false, icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Pedidos Totais', value: '598', trend: '+15%', isPositive: true, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
]

const PAYMENT_METHODS = [
  { name: 'Pix', value: 'R$ 18.500,00', percentage: 57, icon: Banknote, color: 'bg-emerald-500' },
  { name: 'Cartão de Crédito', value: 'R$ 9.200,00', percentage: 28, icon: CreditCard, color: 'bg-blue-500' },
  { name: 'Dinheiro', value: 'R$ 4.780,00', percentage: 15, icon: DollarSign, color: 'bg-amber-500' },
]

export default function AdminFinanceiroPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Relatórios Financeiros</h2>
          <p className="text-slate-500 text-sm mt-1">Acompanhe a saúde financeira do seu negócio em tempo real.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-all">
            <Calendar className="w-4 h-4" /> Este Mês
          </button>
          <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all">
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SUMMARY_STATS.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment Methods Chart Replacement */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Métodos de Pagamento</h3>
            <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Distribuição Mensal</p>
          </div>
          
          <div className="space-y-6">
            {PAYMENT_METHODS.map((method, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${method.color}`} />
                    <span className="text-sm font-bold text-slate-700">{method.name}</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{method.value}</span>
                </div>
                <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${method.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full ${method.color}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Últimas Transações</h3>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-widest">Tempo real</p>
            </div>
            <button className="text-[10px] font-black uppercase text-red-600 hover:text-red-700 transition-colors">Ver Tudo</button>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <tbody className="divide-y divide-slate-50">
                {[
                  { id: '#4829', customer: 'João Silva', date: 'Hoje, 18:45', amount: 'R$ 45,80', method: 'Pix', status: 'Concluído' },
                  { id: '#4828', customer: 'Maria Oliveira', date: 'Hoje, 18:32', amount: 'R$ 89,90', method: 'Cartão', status: 'Concluído' },
                  { id: '#4827', customer: 'Pedro Santos', date: 'Hoje, 18:10', amount: 'R$ 29,90', method: 'Dinheiro', status: 'Pendente' },
                  { id: '#4826', customer: 'Ana Costa', date: 'Hoje, 17:55', amount: 'R$ 42,00', method: 'Pix', status: 'Concluído' },
                  { id: '#4825', customer: 'Lucas Lima', date: 'Hoje, 17:40', amount: 'R$ 55,00', method: 'Pix', status: 'Concluído' },
                ].map((tx, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.method === 'Pix' ? 'bg-emerald-50 text-emerald-600' : tx.method === 'Cartão' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                          {tx.method === 'Pix' ? <Banknote className="w-4 h-4" /> : tx.method === 'Cartão' ? <CreditCard className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{tx.customer}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{tx.id} • {tx.date}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col text-right">
                        <span className="text-sm font-black text-slate-900">{tx.amount}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${tx.status === 'Concluído' ? 'text-emerald-500' : 'text-amber-500'}`}>{tx.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button className="p-2 text-slate-300 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

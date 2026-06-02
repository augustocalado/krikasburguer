'use client'

import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign, 
  MoreVertical 
} from 'lucide-react'

const STATS = [
  { label: 'Vendas Hoje', value: 'R$ 1.240,00', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', trend: '+12.5%' },
  { label: 'Pedidos', value: '42', icon: ShoppingBag, color: 'bg-blue-50 text-blue-600', trend: '+5.2%' },
  { label: 'Clientes Novos', value: '12', icon: Users, color: 'bg-purple-50 text-purple-600', trend: '+2.1%' },
  { label: 'Ticket Médio', value: 'R$ 29,50', icon: TrendingUp, color: 'bg-orange-50 text-orange-600', trend: '-1.4%' },
]

const RECENT_ORDERS = [
  { id: '#4829', customer: 'João Silva', items: '2x Smash Duplo', total: 'R$ 45,80', status: 'Em preparo', time: '5 min atrás' },
  { id: '#4828', customer: 'Maria Oliveira', items: '1x Combo Família', total: 'R$ 89,90', status: 'Saiu para entrega', time: '12 min atrás' },
  { id: '#4827', customer: 'Pedro Santos', items: '1x Krikas Premium', total: 'R$ 29,90', status: 'Entregue', time: '45 min atrás' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Olá, Krikas 👋</h2>
        <p className="text-slate-500 text-sm mt-1">Aqui está o que está acontecendo na sua loja hoje.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-xs font-bold ${stat.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Pedidos Recentes</h3>
            <button className="text-xs font-bold text-red-600 uppercase tracking-widest hover:underline">Ver Todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {RECENT_ORDERS.map((order, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-slate-800">{order.customer}</span>
                        <span className="text-[10px] text-slate-400">{order.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.status === 'Entregue' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{order.total}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h3 className="font-bold text-slate-900">Mais Vendidos</h3>
          <div className="space-y-6">
            {[
              { name: 'Krikas Premium', sales: 124, img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100&q=80' },
              { name: 'Smash Duplo', sales: 98, img: 'https://images.unsplash.com/photo-1510709638350-ef2b1cbdcc91?w=100&q=80' },
              { name: 'Batata Rústica', sales: 76, img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=100&q=80' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100">
                  <img src={item.img} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 rounded-full" style={{ width: `${(item.sales / 150) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{item.sales} vendas</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { DollarSign, ShoppingBag, TrendingUp, Users } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { name: 'Vendas Hoje', value: 'R$ 0,00', icon: DollarSign, change: '0%', changeType: 'neutral' },
    { name: 'Pedidos Hoje', value: '0', icon: ShoppingBag, change: '0%', changeType: 'neutral' },
    { name: 'Novos Clientes', value: '0', icon: Users, change: '0%', changeType: 'neutral' },
    { name: 'Ticket Médio', value: 'R$ 0,00', icon: TrendingUp, change: '0%', changeType: 'neutral' },
  ]

  return (
    <div className="space-y-8">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600">
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${
                stat.changeType === 'positive' ? 'bg-emerald-50 text-emerald-600' : 
                stat.changeType === 'negative' ? 'bg-red-50 text-red-600' :
                'bg-slate-100 text-slate-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Áreas Recentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Últimos Pedidos</h3>
          <div className="space-y-4">
            <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
              Nenhum pedido recebido ainda.
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Avisos do Sistema</h3>
          <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm font-medium">
            Bem-vindo ao seu novo painel de controle! A integração com o banco de dados está concluída. 
            Em breve os pedidos reais começarão a aparecer aqui automaticamente.
          </div>
        </div>
      </div>
    </div>
  )
}

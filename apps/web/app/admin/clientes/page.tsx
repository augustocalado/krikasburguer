'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  User, 
  MessageCircle, 
  MapPin, 
  ShoppingBag, 
  Star,
  ChevronRight,
  MoreVertical,
  Filter,
  ArrowUpRight
} from 'lucide-react'

const ALL_CUSTOMERS = [
  { id: '1', name: 'João Silva', phone: '(11) 98888-7777', address: 'Rua das Flores, 123 - Centro', orders: 12, spent: 'R$ 450,80', lastOrder: '2 dias atrás', rating: 5 },
  { id: '2', name: 'Maria Oliveira', phone: '(11) 97777-6666', address: 'Av. Paulista, 1500 - Bela Vista', orders: 8, spent: 'R$ 312,20', lastOrder: 'Hoje', rating: 4 },
  { id: '3', name: 'Pedro Santos', phone: '(11) 96666-5555', address: 'Rua Augusta, 900 - Jardins', orders: 5, spent: 'R$ 185,00', lastOrder: '1 semana atrás', rating: 5 },
  { id: '4', name: 'Ana Costa', phone: '(11) 95555-4444', address: 'Alameda Santos, 100 - Cerqueira César', orders: 3, spent: 'R$ 112,00', lastOrder: '15 dias atrás', rating: 3 },
  { id: '5', name: 'Lucas Lima', phone: '(11) 94444-3333', address: 'Rua Oscar Freire, 500 - Pinheiros', orders: 15, spent: 'R$ 680,45', lastOrder: 'Ontem', rating: 5 },
]

export default function AdminCustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Base de Clientes</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie seu relacionamento e veja o histórico de cada cliente.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-emerald-100">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              {ALL_CUSTOMERS.length}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total de Clientes</span>
              <span className="text-sm font-bold text-slate-900">Base Ativa</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nome, telefone ou endereço..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:border-red-600/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-slate-50 border border-slate-100 p-3 rounded-2xl text-slate-500 hover:bg-slate-100 transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">Cliente</th>
                <th className="px-8 py-6">WhatsApp</th>
                <th className="px-8 py-6">Pedidos</th>
                <th className="px-8 py-6">Total Gasto</th>
                <th className="px-8 py-6">Último Pedido</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ALL_CUSTOMERS.map((customer, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 font-bold shadow-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{customer.name}</span>
                        <div className="flex items-center gap-1 mt-1">
                          {[1,2,3,4,5].map(star => (
                            <Star key={star} className={`w-2.5 h-2.5 ${star <= customer.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-slate-300" />
                      <span className="text-sm font-bold text-slate-900">{customer.orders}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-900">{customer.spent}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{customer.lastOrder}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors" title="Conversar no WhatsApp"><MessageCircle className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Ver Detalhes"><ArrowUpRight className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 border-t border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Página 1 de 1</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-2.5 text-xs font-black uppercase text-slate-400 hover:text-slate-900 transition-colors">Anterior</button>
            <button className="px-6 py-2.5 text-xs font-black uppercase text-slate-900 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">Próxima</button>
          </div>
        </div>
      </div>

      {/* Destaque de Cliente VIP */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-xl shadow-red-600/20">
          <div className="flex items-center justify-between mb-6">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 fill-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 px-3 py-1 rounded-full">Top Cliente</span>
          </div>
          <h3 className="text-lg font-bold">Lucas Lima</h3>
          <p className="text-white/70 text-sm mt-1">15 pedidos este mês</p>
          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase text-white/50 tracking-widest">Total Gasto</p>
              <p className="text-2xl font-black">R$ 680,45</p>
            </div>
            <button className="p-2 bg-white text-red-600 rounded-xl">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Pizza,
  Layers,
  Settings2
} from 'lucide-react'

const PIZZA_FLAVORS = [
  { id: '1', name: 'Calabresa', category: 'Tradicional', price: 'R$ 45,00', status: 'Ativo', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80' },
  { id: '2', name: 'Portuguesa', category: 'Tradicional', price: 'R$ 52,00', status: 'Ativo', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=100&q=80' },
  { id: '3', name: 'Brigadeiro', category: 'Doce', price: 'R$ 42,00', status: 'Ativo', img: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=100&q=80' },
]

export default function AdminPizzariaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Pizza className="text-orange-600" /> Gestão da Pizzaria
          </h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie sabores, tamanhos e preços das suas pizzas e esfihas.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all">
            <Settings2 className="w-5 h-5" /> Tamanhos
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all"
          >
            <Plus className="w-5 h-5" /> Novo Sabor
          </button>
        </div>
      </div>

      {/* Stats Summary for Pizzaria */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sabores Ativos</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">32</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamanhos Disponíveis</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">5</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Esfihas no Cardápio</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">12</h3>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar sabor de pizza..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-orange-600/20" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest">
                <th className="px-6 py-5">Sabor</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Preço Base</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {PIZZA_FLAVORS.map((flavor, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100">
                        <img src={flavor.img} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{flavor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">{flavor.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900">{flavor.price}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                      {flavor.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-orange-50 rounded-lg text-orange-600 transition-colors"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

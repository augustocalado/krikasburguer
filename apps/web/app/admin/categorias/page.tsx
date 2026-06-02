'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  GripVertical,
  Layers
} from 'lucide-react'

const ALL_CATEGORIES = [
  { id: '1', name: 'Destaque', icon: '⭐', count: 12, status: 'Ativo' },
  { id: '2', name: 'Hambúrguer', icon: '🍔', count: 24, status: 'Ativo' },
  { id: '3', name: 'Combos', icon: '🎁', count: 8, status: 'Ativo' },
  { id: '4', name: 'Smashs', icon: '💥', count: 15, status: 'Ativo' },
  { id: '5', name: 'Bebidas', icon: '🥤', count: 20, status: 'Ativo' },
  { id: '6', name: 'Sobremesa', icon: '🍦', count: 6, status: 'Ativo' },
]

export default function AdminCategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Categorias do Cardápio</h2>
          <p className="text-slate-500 text-sm mt-1">Organize seus produtos em grupos para facilitar a navegação do cliente.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all self-start"
        >
          <Plus className="w-5 h-5" /> Nova Categoria
        </button>
      </div>

      {/* Modal Nova Categoria */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Criar Nova Categoria</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome da Categoria</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-600" placeholder="Ex: Bebidas, Sobremesas..." />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Emoji / Ícone</label>
                <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-600" placeholder="Ex: 🍔, 🥤, 🍦" />
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancelar</button>
                <button className="flex-1 bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">Criar Categoria</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-6 py-5 w-10"></th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5 text-center">Nº de Produtos</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ALL_CATEGORIES.map((cat, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <GripVertical className="w-4 h-4 text-slate-300 cursor-grab active:cursor-grabbing" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100">
                        {cat.icon}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                      <Layers className="w-3 h-3" /> {cat.count} Itens
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                      {cat.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors" title="Editar"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

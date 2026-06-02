'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Trash2, 
  FileSpreadsheet, 
  Calculator, 
  ChevronRight,
  ChevronDown,
  Info,
  DollarSign,
  Utensils,
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react'

const ALL_FICHAS = [
  { 
    id: '1', 
    product: 'Krikas Premium 160g', 
    category: 'Hambúrguer', 
    sellingPrice: 29.90,
    costPrice: 9.85,
    margin: '67%',
    ingredients: [
      { name: 'Blend de Carne 160g', qty: '160g', cost: 4.80 },
      { name: 'Pão Brioche', qty: '1 un', cost: 1.50 },
      { name: 'Queijo Cheddar', qty: '2 fatias', cost: 1.80 },
      { name: 'Bacon', qty: '3 fatias', cost: 1.25 },
      { name: 'Maionese da Casa', qty: '30g', cost: 0.50 },
    ]
  },
  { 
    id: '2', 
    product: 'Smash Duplo 140g', 
    category: 'Smashs', 
    sellingPrice: 22.90,
    costPrice: 7.20,
    margin: '68%',
    ingredients: [
      { name: 'Blend de Carne 70g', qty: '2 un', cost: 4.20 },
      { name: 'Pão Brioche', qty: '1 un', cost: 1.50 },
      { name: 'Queijo Prato', qty: '2 fatias', cost: 1.50 },
    ]
  },
]

export default function AdminFichasTecnicasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFicha, setSelectedFicha] = useState<any>(null)

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fichas Técnicas</h2>
          <p className="text-slate-500 text-sm mt-1">Controle o custo de produção de cada prato e defina seus lucros com precisão.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all self-start"
        >
          <Plus className="w-5 h-5" /> Criar Nova Ficha
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_FICHAS.map((ficha, i) => (
          <motion.div 
            key={ficha.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{ficha.category}</span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-900">{ficha.product}</h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Custo</span>
                    <span className="text-sm font-bold text-slate-900 font-mono">R$ {ficha.costPrice.toFixed(2)}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Venda</span>
                    <span className="text-sm font-bold text-emerald-600 font-mono">R$ {ficha.sellingPrice.toFixed(2)}</span>
                  </div>
                  <div className="w-px h-6 bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Margem</span>
                    <span className="text-sm font-black text-red-600">{ficha.margin}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/50 p-4 border-t border-slate-50 flex items-center justify-between">
              <button 
                onClick={() => setSelectedFicha(ficha)}
                className="text-[10px] font-black uppercase text-slate-400 hover:text-red-600 flex items-center gap-2 transition-all"
              >
                Detalhes da Receita <ChevronRight className="w-3 h-3" />
              </button>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-300 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Detalhes da Ficha */}
      <AnimatePresence>
        {selectedFicha && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedFicha.product}</h3>
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mt-1">Composição Técnica da Receita</p>
                </div>
                <button onClick={() => setSelectedFicha(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Custo Total</span>
                    <span className="text-lg font-black text-slate-900">R$ {selectedFicha.costPrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Markup (Sug.)</span>
                    <span className="text-lg font-black text-emerald-700">3.0x</span>
                  </div>
                  <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest block mb-1">Preço Venda</span>
                    <span className="text-lg font-black text-red-700">R$ {selectedFicha.sellingPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-red-600" /> Ingredientes & Quantidades
                  </h4>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-100">
                          <th className="px-6 py-4">Insumo</th>
                          <th className="px-6 py-4">Quantidade</th>
                          <th className="px-6 py-4 text-right">Custo Proporc.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedFicha.ingredients.map((ing: any, i: number) => (
                          <tr key={i} className="text-sm">
                            <td className="px-6 py-4 font-medium text-slate-700">{ing.name}</td>
                            <td className="px-6 py-4 text-slate-500">{ing.qty}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900">R$ {ing.cost.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100/50">
                          <td colSpan={2} className="px-6 py-4 text-xs font-black uppercase text-slate-400">Total Produção</td>
                          <td className="px-6 py-4 text-right font-black text-slate-900 text-lg">R$ {selectedFicha.costPrice.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 bg-white flex gap-4">
                <button className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all">
                  <Calculator className="w-5 h-5" /> Recalcular Custos
                </button>
                <button className="px-8 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-all">
                  Editar Ficha
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Informativo CMV */}
      <div className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-emerald-600/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            <h3 className="text-xl font-bold">Dica de Gestão: O Markup Ideal</h3>
          </div>
          <p className="text-emerald-100 text-sm max-w-xl">
            Para manter o KrikasBurguer lucrativo, tente manter seu custo de produção em torno de 30% a 35% do preço de venda. Fichas técnicas com margem abaixo de 60% precisam de atenção!
          </p>
        </div>
        <button className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 whitespace-nowrap hover:bg-emerald-50 transition-all shadow-lg shadow-black/10">
          Analisar Todas as Margens <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

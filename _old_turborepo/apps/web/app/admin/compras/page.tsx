'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Trash2, 
  Calculator, 
  Package, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Filter,
  MoreVertical,
  ClipboardList
} from 'lucide-react'

const INITIAL_INSUMOS = [
  { id: '1', name: 'Carne Moída (Blend)', qty: 50, measure: 'kg', price: 1250.00, status: 'Estoque OK' },
  { id: '2', name: 'Pão Brioche', qty: 200, measure: 'un', price: 300.00, status: 'Baixo Estoque' },
  { id: '3', name: 'Queijo Cheddar (Fatias)', qty: 10, measure: 'pacote', price: 180.00, status: 'Estoque OK' },
  { id: '4', name: 'Bacon Defumado', qty: 15, measure: 'kg', price: 420.00, status: 'Estoque OK' },
  { id: '5', name: 'Batata Congelada Palito', qty: 30, measure: 'kg', price: 270.00, status: 'Estoque OK' },
]

export default function AdminComprasPage() {
  const [insumos, setInsumos] = useState(INITIAL_INSUMOS)
  const [searchTerm, setSearchTerm] = useState('')

  const totalInvestment = insumos.reduce((acc, curr) => acc + curr.price, 0)
  
  // Cálculo de Custo Unitário Médio
  const getUnitCost = (item: any) => {
    return (item.price / item.qty).toFixed(2)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Checklist de Compras & CMV</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie seus insumos e calcule o custo de mercadoria para otimizar seus lucros.</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all self-start">
          <Plus className="w-5 h-5" /> Novo Insumo
        </button>
      </div>

      {/* CMV / Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Investimento em Insumos</p>
            <p className="text-xl font-black text-slate-900">R$ {totalInvestment.toFixed(2).replace('.', ',')}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CMV Estimado</p>
            <p className="text-xl font-black text-emerald-600">32.5%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Itens para Reposição</p>
            <p className="text-xl font-black text-amber-600">01 item</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Pesquisar insumo..." 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-600/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-8 py-6">Insumo</th>
                <th className="px-8 py-6">Qtd. Inicial</th>
                <th className="px-8 py-6">Valor Compra</th>
                <th className="px-8 py-6">Custo Unit.</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {insumos.map((item, i) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                        <Package className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-600">{item.qty} {item.measure}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-black text-slate-900">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-emerald-600">R$ {getUnitCost(item)}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">por {item.measure}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      item.status === 'Estoque OK' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status === 'Estoque OK' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                      {item.status}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors" title="Editar"><MoreVertical className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shopping List Section */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/20">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <ClipboardList className="w-40 h-40" />
        </div>
        <div className="relative z-10 max-w-lg space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-[10px] font-black uppercase tracking-widest mb-4">Geração Automática</span>
            <h3 className="text-2xl font-black">Lista de Compras da Semana</h3>
            <p className="text-slate-400 text-sm mt-2">O sistema analisa seu faturamento e estoque para sugerir os itens que precisam ser repostos.</p>
          </div>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-black/20">
            <ClipboardList className="w-5 h-5" /> Gerar Nova Lista
          </button>
        </div>
      </div>
    </div>
  )
}

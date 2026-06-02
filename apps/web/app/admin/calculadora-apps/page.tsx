'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Calculator, 
  Smartphone, 
  Truck, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  DollarSign,
  ArrowRight,
  ChevronDown,
  Percent,
  HelpCircle
} from 'lucide-react'

const PLATFORMS = [
  { id: 'ifood', name: 'iFood', commissionPlatform: 0.23, commissionOwn: 0.12, fixedFee: 0.99 },
  { id: '99food', name: '99Food', commissionPlatform: 0.22, commissionOwn: 0.10, fixedFee: 0.00 },
  { id: 'keeta', name: 'Keeta', commissionPlatform: 0.20, commissionOwn: 0.08, fixedFee: 0.50 },
]

const PRODUCTS = [
  { id: '1', name: 'Krikas Premium 160g', basePrice: 29.90 },
  { id: '2', name: 'Smash Duplo 140g', basePrice: 22.90 },
  { id: '3', name: 'Combo Casal', basePrice: 55.00 },
]

export default function AdminCalculadoraAppsPage() {
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0])
  const [logisticMode, setLogisticMode] = useState<'platform' | 'own'>('platform')
  const [markupDesired, setMarkupDesired] = useState(1.1) // 10% extra on top of platform fees to cover operational costs

  const calculateAppPrice = (basePrice: number) => {
    const commission = logisticMode === 'platform' ? selectedPlatform.commissionPlatform : selectedPlatform.commissionOwn
    // Fórmula: Preço Final = (Preço Base + Taxa Fixa) / (1 - Comissão)
    // Aplicamos um pequeno markup adicional para segurança
    const finalPrice = ((basePrice + selectedPlatform.fixedFee) / (1 - commission)) * markupDesired
    return finalPrice.toFixed(2)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Calculadora de Marketplaces</h2>
          <p className="text-slate-500 text-sm mt-1">Ajuste seus preços automaticamente para apps de entrega sem perder lucro.</p>
        </div>
        <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100">
          <AlertTriangle className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-wider">Evite Prejuízos</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">1. Selecione a Plataforma</label>
              <div className="grid grid-cols-1 gap-3">
                {PLATFORMS.map((platform) => (
                  <button 
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                      selectedPlatform.id === platform.id ? 'border-red-600 bg-red-50/50 text-red-600' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    <span className="font-bold">{platform.name}</span>
                    {selectedPlatform.id === platform.id && <CheckCircle2 className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">2. Modo de Entrega</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setLogisticMode('platform')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    logisticMode === 'platform' ? 'border-red-600 bg-red-50/50 text-red-600' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase">Entrega do App</span>
                </button>
                <button 
                  onClick={() => setLogisticMode('own')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                    logisticMode === 'own' ? 'border-red-600 bg-red-50/50 text-red-600' : 'border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <Truck className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase">Entrega Própria</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block">3. Margem Adicional (Segurança)</label>
                <div className="p-1 text-slate-400"><HelpCircle className="w-4 h-4" /></div>
              </div>
              <input 
                type="range" 
                min="1.0" 
                max="1.5" 
                step="0.05" 
                value={markupDesired}
                onChange={(e) => setMarkupDesired(parseFloat(e.target.value))}
                className="w-full accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span>Sem Extra</span>
                <span className="text-red-600">+{((markupDesired - 1) * 100).toFixed(0)}% de Segurança</span>
                <span>Máximo</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 text-white space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest">Resumo das Taxas</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Comissão de Venda:</span>
                <span className="font-bold">{( (logisticMode === 'platform' ? selectedPlatform.commissionPlatform : selectedPlatform.commissionOwn) * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Taxa Fixa p/ Pedido:</span>
                <span className="font-bold">R$ {selectedPlatform.fixedFee.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Preços Sugeridos para {selectedPlatform.name}</h3>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Modo: {logisticMode === 'platform' ? 'Logística App' : 'Logística Própria'}</span>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                  <th className="px-8 py-6">Produto</th>
                  <th className="px-8 py-6">Preço no Zap (Original)</th>
                  <th className="px-8 py-6">Taxas Estimadas</th>
                  <th className="px-8 py-6 text-right">Preço Recomendado no App</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PRODUCTS.map((product, i) => {
                  const finalPrice = calculateAppPrice(product.basePrice)
                  const totalFee = parseFloat(finalPrice) - product.basePrice
                  
                  return (
                    <motion.tr 
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-slate-900">{product.name}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-500">R$ {product.basePrice.toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-rose-500">- R$ {totalFee.toFixed(2)}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Impacto da Plataforma</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-lg font-black text-slate-900">R$ {finalPrice}</span>
                          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                            Lucro Preservado <CheckCircle2 className="w-3 h-3" />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="p-8 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-4 text-slate-500 bg-white p-6 rounded-2xl border border-slate-200">
              <Calculator className="w-10 h-10 text-red-600 flex-shrink-0" />
              <div className="text-xs leading-relaxed">
                <p className="font-bold text-slate-900 mb-1">Como o cálculo é feito?</p>
                Utilizamos a fórmula de **Margem por Dentro**: `(Preço Original + Taxas Fixas) / (1 - Taxa de Comissão)`. 
                Isso garante que, após o iFood retirar a parte dele, o que sobrar no seu bolso seja exatamente o seu preço original (mais a margem de segurança definida).
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Store, 
  Truck, 
  Palette, 
  Save, 
  MapPin, 
  Clock, 
  Camera, 
  Trash2, 
  Plus,
  DollarSign,
  ListChecks,
  FileSpreadsheet,
  Smartphone,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Banknote,
  Download,
  Package,
  Calculator,
  CheckCircle2,
  AlertCircle,
  Utensils,
  ChevronRight,
  Info,
  X,
  PlusCircle,
  HelpCircle,
  Smartphone as SmartphoneIcon
} from 'lucide-react'

// --- MOCK DATA ---
const INITIAL_NEIGHBORHOODS = [
  { id: '1', name: 'Centro', fee: '5.00' },
  { id: '2', name: 'Jardim América', fee: '8.00' },
  { id: '3', name: 'Vila Nova', fee: '10.00' },
]

const FINANCIAL_STATS = [
  { label: 'Faturamento Hoje', value: 'R$ 1.250,00', trend: '+12%', isPositive: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Faturamento Mês', value: 'R$ 32.480,00', trend: '+8.5%', isPositive: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
]

const INITIAL_INSUMOS = [
  { id: '1', name: 'Carne Moída (Blend)', qty: 50, measure: 'kg', price: 1250.00, status: 'Estoque OK' },
  { id: '2', name: 'Pão Brioche', qty: 200, measure: 'un', price: 300.00, status: 'Baixo Estoque' },
]

const FICHAS = [
  { id: '1', product: 'Krikas Premium 160g', category: 'Hambúrguer', sellingPrice: 29.90, costPrice: 9.85, margin: '67%' },
  { id: '2', product: 'Smash Duplo 140g', category: 'Smashs', sellingPrice: 22.90, costPrice: 7.20, margin: '68%' },
]

const PLATFORMS = [
  { id: 'ifood', name: 'iFood', commissionPlatform: 0.23, commissionOwn: 0.12, fixedFee: 0.99 },
  { id: '99food', name: '99Food', commissionPlatform: 0.22, commissionOwn: 0.10, fixedFee: 0.00 },
]

// --- COMPONENTS ---

export default function AdminConfigPage() {
  const [activeTab, setActiveTab] = useState('loja')
  const [neighborhoods, setNeighborhoods] = useState(INITIAL_NEIGHBORHOODS)

  // Sub-states for specific tabs
  const [selectedFicha, setSelectedFicha] = useState<any>(null)
  const [selectedPlatform, setSelectedPlatform] = useState(PLATFORMS[0])
  const [logisticMode, setLogisticMode] = useState<'platform' | 'own'>('platform')

  const tabs = [
    { id: 'loja', label: 'Loja', icon: Store },
    { id: 'logistica', label: 'Logística', icon: Truck },
    { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
    { id: 'estoque', label: 'Estoque', icon: ListChecks },
    { id: 'fichas', label: 'Fichas Técnicas', icon: FileSpreadsheet },
    { id: 'calculadora', label: 'Calculadora Apps', icon: Smartphone },
    { id: 'aparencia', label: 'Aparência', icon: Palette },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Configurações do Sistema</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie todos os aspectos do seu negócio em um só lugar.</p>
        </div>
        <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
          <Save className="w-5 h-5" /> Salvar Tudo
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <aside className="lg:w-72 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all text-sm font-bold ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                  : 'text-slate-500 hover:bg-white hover:shadow-sm'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-red-500' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-6"
            >
              {/* --- TAB: LOJA --- */}
              {activeTab === 'loja' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Store className="w-5 h-5 text-red-600" /> Informações Básicas
                      </h3>
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nome da Loja</label>
                          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600" defaultValue="KrikasBurguer" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">WhatsApp de Pedidos</label>
                          <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600" defaultValue="(11) 99999-9999" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-red-600" /> Horário de Funcionamento
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-600">Segunda - Quinta</span>
                          <span className="font-bold text-slate-900">18:00 - 23:30</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-600">Sexta - Domingo</span>
                          <span className="font-bold text-slate-900">18:00 - 01:00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: LOGISTICA --- */}
              {activeTab === 'logistica' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-red-600" /> Taxas de Entrega por Bairro
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">Defina o valor do frete para cada região que você atende.</p>
                    </div>
                    <button className="text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Adicionar Bairro
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {neighborhoods.map((n) => (
                      <div key={n.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900">{n.name}</span>
                          <span className="text-xs text-slate-500">Taxa: R$ {n.fee}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white rounded-lg text-slate-400"><Save className="w-4 h-4" /></button>
                          <button className="p-2 hover:bg-white rounded-lg text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* --- TAB: FINANCEIRO --- */}
              {activeTab === 'financeiro' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FINANCIAL_STATS.map((stat, i) => (
                      <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-2.5 ${stat.bg} ${stat.color} rounded-xl`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{stat.trend}</div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                          <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Métodos de Pagamento</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <Banknote className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-bold">Pix</span>
                        </div>
                        <span className="font-black text-slate-900">R$ 18.500,00 (57%)</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-bold">Cartão</span>
                        </div>
                        <span className="font-black text-slate-900">R$ 9.200,00 (28%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- TAB: ESTOQUE --- */}
              {activeTab === 'estoque' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">Controle de Insumos & CMV</h3>
                      <p className="text-slate-400 text-sm mt-1 uppercase font-bold tracking-widest">Checklist de Compras</p>
                    </div>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Novo Insumo</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                          <th className="py-4">Insumo</th>
                          <th className="py-4">Qtd.</th>
                          <th className="py-4 text-right">Preço</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {INITIAL_INSUMOS.map((item) => (
                          <tr key={item.id} className="text-sm">
                            <td className="py-4 font-bold text-slate-900">{item.name}</td>
                            <td className="py-4 text-slate-500">{item.qty} {item.measure}</td>
                            <td className="py-4 text-right font-black text-slate-900">R$ {item.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- TAB: FICHAS --- */}
              {activeTab === 'fichas' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {FICHAS.map((ficha) => (
                    <div key={ficha.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <Utensils className="w-5 h-5 text-red-600" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ficha.margin} Margem</span>
                      </div>
                      <h4 className="font-bold text-slate-900">{ficha.product}</h4>
                      <div className="flex justify-between items-end border-t border-slate-50 pt-4">
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase font-bold">Custo de Produção</p>
                          <p className="text-lg font-black text-slate-900">R$ {ficha.costPrice.toFixed(2)}</p>
                        </div>
                        <button className="text-[10px] font-bold text-red-600 uppercase">Ver Receita</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- TAB: CALCULADORA --- */}
              {activeTab === 'calculadora' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                   <div className="flex flex-col md:flex-row gap-8">
                     <div className="md:w-1/3 space-y-6">
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Plataforma</label>
                          <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none">
                            <option>iFood</option>
                            <option>99Food</option>
                            <option>Keeta</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Logística</label>
                          <div className="grid grid-cols-2 gap-2">
                            <button className="p-3 bg-red-600 text-white border border-red-600 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-600/20">App</button>
                            <button className="p-3 bg-white text-slate-400 border border-slate-200 rounded-xl text-[10px] font-black uppercase">Própria</button>
                          </div>
                        </div>
                     </div>
                     <div className="flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Sugestão de Preços</h4>
                        <div className="space-y-6">
                           <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                              <span className="text-sm font-bold text-slate-900">Krikas Premium</span>
                              <span className="text-base font-black text-red-600">R$ 38,90</span>
                           </div>
                           <div className="flex items-center justify-between border-b border-slate-200/50 pb-4">
                              <span className="text-sm font-bold text-slate-900">Smash Duplo</span>
                              <span className="text-base font-black text-red-600">R$ 29,90</span>
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
              )}

              {/* --- TAB: APARENCIA --- */}
              {activeTab === 'aparencia' && (
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-red-600" /> Identidade Visual
                      </h3>
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors cursor-pointer">
                          <Camera className="w-8 h-8" />
                          <span className="text-[10px] font-bold uppercase mt-1">Logo</span>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cor Principal</label>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-red-600 rounded-lg shadow-sm" />
                              <input type="text" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600" defaultValue="#EF4444" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

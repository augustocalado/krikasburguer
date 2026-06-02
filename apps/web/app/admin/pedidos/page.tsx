'use client'

import { motion } from 'framer-motion'
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Printer, 
  CheckCircle2, 
  Clock, 
  Truck,
  User,
  ShoppingBag,
  CreditCard,
  MapPin,
  Check
} from 'lucide-react'

const ALL_ORDERS = [
  { id: '#4829', customer: 'João Silva', items: ['2x Smash Duplo', '1x Coca Lata'], total: '45,80', status: 'Em preparo', time: '5 min atrás', payment: 'Pix', address: 'Rua das Flores, 123' },
  { id: '#4828', customer: 'Maria Oliveira', items: ['1x Combo Família', '1x Batata G'], total: '89,90', status: 'A caminho', time: '12 min atrás', payment: 'Cartão', address: 'Av. Brasil, 500' },
  { id: '#4827', customer: 'Pedro Santos', items: ['1x Krikas Premium'], total: '29,90', status: 'Pendente', time: '15 min atrás', payment: 'Dinheiro', address: 'Rua Central, 45' },
  { id: '#4826', customer: 'Ana Costa', items: ['3x Smash Simples'], total: '42,00', status: 'Entregue', time: '1h atrás', payment: 'Pix', address: 'Rua XV de Novembro, 88' },
  { id: '#4825', customer: 'Lucas Lima', items: ['1x Combo Casal'], total: '55,00', status: 'Entregue', time: '2h atrás', payment: 'Pix', address: 'Rua do Porto, 12' },
  { id: '#4824', customer: 'Carla Dias', items: ['2x Krikas Bacon', '1x Suco Laranja'], total: '68,50', status: 'Em preparo', time: '8 min atrás', payment: 'Cartão', address: 'Vila Madalena, 9' },
]

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gerenciamento de Pedidos</h2>
          <p className="text-slate-500 text-sm mt-1">Acompanhe e despache os pedidos da sua hamburgueria.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-slate-200 p-3 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou ID..." 
              className="bg-white border border-slate-200 rounded-2xl py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 w-72 shadow-sm transition-all" 
            />
          </div>
        </div>
      </div>

      {/* Grid Layout: 3 products per line as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ORDERS.map((order, i) => (
          <motion.div 
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all overflow-hidden flex flex-col group"
          >
            {/* Card Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-slate-400">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-900 tracking-wider uppercase">{order.id}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{order.time}</span>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                order.status === 'Entregue' ? 'bg-emerald-50 text-emerald-600' : 
                order.status === 'A caminho' ? 'bg-blue-50 text-blue-600' :
                order.status === 'Em preparo' ? 'bg-amber-50 text-amber-600' :
                'bg-rose-50 text-rose-600'
              }`}>
                {order.status}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Customer */}
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                  <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {order.address}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-slate-50/50 rounded-2xl p-4 space-y-2 border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Itens do Pedido</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <div className="w-1 h-1 bg-red-400 rounded-full" />
                    {item}
                  </div>
                ))}
              </div>

              {/* Payment & Total */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{order.payment}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-xl font-black text-slate-900">R$ {order.total}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-50 grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-100 transition-all">
                <Eye className="w-4 h-4" /> Detalhes
              </button>
              <button className="flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all">
                <Check className="w-4 h-4" /> Despachar
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4">
        <p className="text-sm font-bold text-slate-400">Mostrando <span className="text-slate-900">6</span> de 142 pedidos hoje</p>
        <div className="flex gap-2">
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-all">Anterior</button>
           <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 shadow-sm hover:border-slate-300 transition-all">Próxima</button>
        </div>
      </div>
    </div>
  )
}

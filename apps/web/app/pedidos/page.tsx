'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ClipboardList, MessageCircle, Clock, CheckCircle2, Home as HomeIcon, UtensilsCrossed } from 'lucide-react'
import Link from 'next/link'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('krikas_orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          // Garante que só carregamos dados válidos
          const validOrders = parsed.filter(o => o && typeof o === 'object' && o.id)
          setOrders(validOrders)
        }
      } catch (e) {
        console.error("Erro ao carregar pedidos:", e)
        setOrders([])
      }
    }
    setLoading(false)
  }, [])

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/menu" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-600">Voltar ao cardápio</span>
          </Link>
          <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Meus Pedidos</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 pt-8">
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pedido #{order.id}</span>
                    <h3 className="text-sm font-bold text-slate-800">{order.date}</h3>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider ${
                    order.status === 'Entregue' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {order.status === 'Entregue' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3 animate-pulse" />}
                    {order.status}
                  </div>
                </div>

                <div className="py-3 border-y border-slate-50">
                  <p className="text-xs text-slate-500 leading-relaxed italic">
                    "{typeof order.items === 'string' ? order.items : 'Erro ao carregar itens'}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Total pago</span>
                    <span className="text-base font-bold text-slate-900">
                      R$ {isNaN(Number(order.total)) ? '0,00' : Number(order.total).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                    Ajuda <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                <ClipboardList className="w-10 h-10 text-slate-200" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Nenhum pedido ainda</h2>
                <p className="text-sm text-slate-500">Seus pedidos aparecerão aqui assim que você finalizar sua primeira compra.</p>
              </div>
              <Link href="/menu" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                Ir para o cardápio
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <nav className="bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
          </Link>
          <Link href="/menu" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cardápio</span>
          </Link>
          <Link href="/pedidos" className="flex flex-col items-center gap-1 text-red-600">
            <ClipboardList className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Pedidos</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

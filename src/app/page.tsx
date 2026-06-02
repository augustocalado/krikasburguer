'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Camera, 
  MessageCircle, 
  Star, 
  ChevronRight,
  Utensils,
  Truck,
  ShieldCheck,
  Heart,
  Home,
  User,
  Plus
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-600">
      
      {/* 1. HERO SECTION (Reference: Big splash image) */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-burger.png" 
            alt="Krikas Burger Hero" 
            className="w-full h-full object-cover scale-110 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl shadow-red-600/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Loja Aberta • Peça Agora
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white leading-tight tracking-tighter">
              O MELHOR HAMBÚRGUER <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400">DA CIDADE</span>
            </h1>
            
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              O hambúrguer artesanal mais premiado da região. Ingredientes frescos, blend exclusivo e aquele pão brioche que derrete na boca.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/menu" className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-red-600/40 transition-all active:scale-95 flex items-center justify-center gap-3">
                <ShoppingBag className="w-6 h-6" /> VER CARDÁPIO
              </Link>
              <Link href="/quem-somos" className="w-full md:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black text-lg transition-all border border-white/20 flex items-center justify-center gap-3">
                QUEM SOMOS <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 hidden md:block">
          <div className="grid grid-cols-3 gap-6 bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10">
            <div className="text-center border-r border-white/10">
              <p className="text-3xl font-black text-white">4.9</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Google Reviews</p>
            </div>
            <div className="text-center border-r border-white/10">
              <p className="text-3xl font-black text-white">30min</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Entrega Média</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-black text-white">+10k</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Clientes Felizes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURES SECTION (Reference: Icons for quality/experience) */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Qualidade Premium</h2>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">O segredo do nosso sucesso</h3>
            <div className="h-1.5 w-20 bg-red-600 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: Utensils, title: 'Carne 100% Angus', desc: 'Blends exclusivos moídos diariamente para garantir frescor.' },
              { icon: ShieldCheck, title: 'Higiene Rigorosa', desc: 'Processos certificados e cozinha aberta para sua segurança.' },
              { icon: Truck, title: 'Entrega Rápida', desc: 'Sua fome não espera. Sistema logístico otimizado.' },
              { icon: Heart, title: 'Feito com Amor', desc: 'Cada detalhe importa, desde a cebola até o pão tostado.' },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-red-600/5 transition-all text-center group"
              >
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTS (Reference: Special products) */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em]">Favoritos da Galera</h2>
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Os Mais Pedidos</h3>
            </div>
            <Link href="/menu" className="text-red-600 font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all group">
              VER CARDÁPIO COMPLETO <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Krikas Premium', price: '29.90', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80' },
              { name: 'Pink Lemonade', price: '14.90', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80' },
              { name: 'Combo Casal', price: '66.90', img: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80' },
            ].map((p, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] mb-6">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <Link href="/menu" className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-50 transition-colors">
                      ADICIONAR AO PEDIDO <Plus className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-xl font-black text-slate-900">{p.name}</h4>
                  <span className="text-red-600 font-black text-lg">R$ {p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOOTER / CONTACT (Reference: Map, social, contact) */}
      <Footer />

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 20s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}

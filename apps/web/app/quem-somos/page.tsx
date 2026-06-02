'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Footer } from '@/components/Footer'
import { ArrowLeft, Clock, Award, Users, Heart } from 'lucide-react'

export default function QuemSomos() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-red-100 selection:text-red-600">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-black text-sm uppercase tracking-widest">Voltar</span>
          </Link>
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain rounded-full" />
            Krikas<span className="text-red-500">Burguer</span>
          </div>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-red-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 text-red-600 mb-4">
              <Clock className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
              Nossa História,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">Seu Sabor.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
              Desde 2015 transformando o delivery da região. Não somos apenas uma hamburgueria, somos uma experiência completa na sua casa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square md:aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl shadow-red-900/10"
            >
              <img 
                src="https://images.unsplash.com/photo-1586816001966-79b736744398?w=800&q=80" 
                alt="Nossa Cozinha" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-white">
                  <p className="text-3xl font-black mb-1">2015</p>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-80">O ano que tudo começou</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Atuamos desde 2015 no Delivery</h2>
                <div className="h-1.5 w-16 bg-red-600 rounded-full" />
              </div>

              <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
                <p>
                  Tudo começou com uma ideia simples: entregar o melhor hambúrguer artesanal da cidade, no conforto da sua casa. 
                </p>
                <p>
                  Com o passar dos anos, fomos aperfeiçoando nossas receitas, criando blends exclusivos de carne 100% Angus e desenvolvendo molhos que se tornaram a nossa marca registrada.
                </p>
                <p>
                  Hoje, temos orgulho de ser referência em delivery, mantendo a mesma paixão e cuidado do nosso primeiro dia de funcionamento.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg">Qualidade</h3>
                  <p className="text-sm text-slate-500">Ingredientes frescos todos os dias.</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg">Paixão</h3>
                  <p className="text-sm text-slate-500">Amamos o que fazemos.</p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-20 mb-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-900/20 to-transparent" />
            <div className="relative z-10 space-y-8">
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Deu fome aí?</h2>
              <p className="text-slate-400 text-lg max-w-xl mx-auto">
                Agora que você já conhece um pouco da nossa história, que tal provar o sabor que conquistou a cidade?
              </p>
              <Link href="/menu" className="inline-flex bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/30 transition-all hover:scale-105 items-center gap-3">
                FAZER MEU PEDIDO AGORA
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

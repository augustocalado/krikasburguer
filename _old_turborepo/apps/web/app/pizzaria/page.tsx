'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X, Search, ArrowLeft, MessageCircle, Home as HomeIcon, UtensilsCrossed, ClipboardList, Pizza } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { id: 'tradicionais', name: 'Tradicionais', icon: '🍕' },
  { id: 'especiais', name: 'Especiais', icon: '🌟' },
  { id: 'doces', name: 'Pizzas Doces', icon: '🍫' },
  { id: 'esfihas', name: 'Esfihas', icon: '🥟' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' },
]

const PRODUCTS = [
  {
    id: 'p1',
    categoryId: 'tradicionais',
    name: 'Pizza Inteira (8 fatias)',
    description: 'Escolha até 3 sabores. Massa artesanal e molho de tomate fresco.',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80',
    isPizza: true,
    maxFlavors: 3
  },
  {
    id: 'p2',
    categoryId: 'tradicionais',
    name: 'Pizza Broto (4 fatias)',
    description: 'Escolha 1 sabor. Ideal para uma pessoa.',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=400&q=80',
    isPizza: true,
    maxFlavors: 1
  },
  {
    id: 'e1',
    categoryId: 'esfihas',
    name: 'Esfiha de Carne',
    description: 'Carne temperada com especiarias árabes.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=400&q=80',
  }
]

const FLAVORS = [
  { name: 'Calabresa', price: 0 },
  { name: 'Mussarela', price: 0 },
  { name: 'Portuguesa', price: 5.00 },
  { name: 'Quatro Queijos', price: 8.00 },
  { name: 'Frango c/ Catupiry', price: 4.00 },
]

export default function PizzariaPage() {
  const [cart, setCart] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedFlavors, setSelectedFlavors] = useState<any[]>([])
  const [flavorSearch, setFlavorSearch] = useState('')
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const filteredFlavors = FLAVORS.filter(f => 
    f.name.toLowerCase().includes(flavorSearch.toLowerCase())
  )

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const handleAddProduct = () => {
    const flavorsPrice = selectedFlavors.reduce((acc, f) => acc + f.price, 0)
    const pizzaName = selectedProduct.isPizza 
      ? `${selectedProduct.name} (${selectedFlavors.map(f => f.name).join(' / ')})`
      : selectedProduct.name

    setCart(prev => [...prev, { 
      ...selectedProduct, 
      name: pizzaName,
      price: selectedProduct.price + flavorsPrice,
      quantity: 1
    }])
    setSelectedProduct(null)
    setSelectedFlavors([])
    setFlavorSearch('')
  }

  const sendToWhatsApp = () => {
    const orderId = Math.floor(1000 + Math.random() * 9000).toString();
    const itemsList = cart.map(item => `✅ *${item.quantity}x ${item.name}* - R$ ${(item.price * item.quantity).toFixed(2)}`).join('\n');
    const message = `*🍕 NOVO PEDIDO (#${orderId}) - KRIKAS PIZZARIA*\n\n👤 *Cliente:* ${formData.name}\n📍 *Endereço:* ${formData.address}\n\n🛒 *Itens:*\n${itemsList}\n\n🚀 *Total:* R$ ${cartTotal.toFixed(2)}`;
    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">
      {/* Header - Identical to Burger Menu but Orange */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-slate-600">Voltar</span>
          </Link>
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar pizzas e esfihas" className="w-full bg-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none" />
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Store Info */}
      <div className="bg-white px-4 pt-6 pb-4 max-w-5xl mx-auto border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">Krikas Pizzaria</h1>
            <div className="flex items-center gap-3 text-xs text-orange-600 font-bold">
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Aberto agora • 18:00 - 23:30
            </div>
          </div>
        </div>
      </div>

      {/* Category Bar */}
      <div className="sticky top-16 bg-white border-b border-slate-100 z-40 overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-8 h-14 items-center whitespace-nowrap">
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} className="text-sm font-bold text-slate-500 hover:text-orange-600 active:text-orange-600 transition-colors">{cat.name}</a>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {CATEGORIES.map((category) => {
          const categoryProducts = PRODUCTS.filter(p => p.categoryId === category.id);
          if (categoryProducts.length === 0) return null;
          return (
            <div key={category.id} id={category.id} className="mb-12 scroll-mt-32">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
                <div className="w-12 h-1 bg-orange-600 mt-2" />
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-8">
                {categoryProducts.map((product) => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="flex items-start gap-4 py-4 md:pb-8 border-b border-slate-100 cursor-pointer active:bg-slate-50 transition-colors">
                    <div className="flex-1 space-y-1">
                      <h3 className="text-[15px] font-medium text-slate-800">{product.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                      <div className="pt-2 text-sm font-medium text-orange-600">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                    </div>
                    <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100">
                      <img src={product.image} className="w-full h-full object-cover" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      {/* Product Modal - Standardized with Pizza Flavor selection built-in */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-0 md:p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[90vh] md:rounded-xl overflow-hidden flex flex-col md:flex-row relative shadow-2xl"
            >
              <button onClick={() => { setSelectedProduct(null); setSelectedFlavors([]); }} className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow-lg">
                <X className="w-5 h-5 text-slate-900" />
              </button>

              <div className="w-full md:w-1/2 h-48 md:h-auto bg-slate-100 overflow-hidden">
                <img src={selectedProduct.image} className="w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-1/2 flex flex-col h-full md:max-h-[90vh]">
                <div className="p-8 overflow-y-auto flex-1 no-scrollbar space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h2>
                    <p className="text-sm text-slate-500 mt-2">{selectedProduct.description}</p>
                  </div>

                  {selectedProduct.isPizza && (
                    <div className="space-y-4">
                      <div className="bg-orange-50 px-8 py-3 border-y border-orange-100 flex justify-between items-center -mx-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-orange-800">Escolha os Sabores</span>
                          <span className="text-[10px] text-orange-400 uppercase font-bold tracking-widest">Até {selectedProduct.maxFlavors} sabores</span>
                        </div>
                      </div>
                      
                      {/* Busca de Sabores */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input 
                          type="text" 
                          placeholder="Pesquisar sabor..." 
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-orange-600/30"
                          value={flavorSearch}
                          onChange={(e) => setFlavorSearch(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        {filteredFlavors.map(flavor => {
                          const isSelected = selectedFlavors.some(f => f.name === flavor.name)
                          const isDisabled = selectedFlavors.length >= selectedProduct.maxFlavors && !isSelected
                          return (
                            <div 
                              key={flavor.name} 
                              onClick={() => {
                                if (isSelected) setSelectedFlavors(prev => prev.filter(f => f.name !== flavor.name))
                                else if (!isDisabled) setSelectedFlavors(prev => [...prev, flavor])
                              }}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                                isSelected ? 'border-orange-600 bg-orange-50' : 'border-slate-100'
                              } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                            >
                              <span className="text-sm font-medium">{flavor.name}</span>
                              <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-slate-200'}`}>
                                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                            </div>
                          )
                        })}
                        {filteredFlavors.length === 0 && (
                          <div className="text-center py-8 text-slate-400 italic text-sm">Nenhum sabor encontrado...</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-8 border-t border-slate-100 bg-white">
                  <button 
                    onClick={handleAddProduct}
                    disabled={selectedProduct.isPizza && selectedFlavors.length === 0}
                    className="w-full bg-orange-600 text-white h-12 rounded-xl font-bold flex items-center justify-between px-8 shadow-lg shadow-orange-600/20 active:scale-95 transition-all disabled:bg-slate-200"
                  >
                    <span>Adicionar à sacola</span>
                    <span>R$ {selectedProduct.price.toFixed(2).replace('.', ',')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Cart & Bottom Nav - Standardized */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {cartCount > 0 && !isCheckoutOpen && (
          <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="bg-white border-t border-slate-100 p-4 shadow-xl mx-4 mb-4 rounded-xl flex items-center justify-between">
            <span className="text-xl font-bold">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
            <button onClick={() => setIsCheckoutOpen(true)} className="bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-sm">Ver sacola ({cartCount})</button>
          </motion.div>
        )}

        <nav className="bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center pb-safe md:hidden">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400"><HomeIcon className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Início</span></Link>
          <Link href="/pizzaria" className="flex flex-col items-center gap-1 text-orange-600"><Pizza className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Pizzaria</span></Link>
          <Link href="/pedidos" className="flex flex-col items-center gap-1 text-slate-400"><ClipboardList className="w-6 h-6" /><span className="text-[10px] font-bold uppercase">Pedidos</span></Link>
        </nav>
      </div>

      {/* Checkout Drawer (Standardized) */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-end md:items-center justify-center p-0 md:p-4"
          >
            <motion.div
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="bg-white w-full max-w-xl h-[95vh] md:h-auto md:max-h-[85vh] md:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-1"><ArrowLeft className="w-5 h-5 text-orange-600" /></button>
                  <h2 className="text-lg font-bold text-slate-900">Sua sacola 🍕</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-4 border-b border-slate-50 last:border-0">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0"><img src={item.image} className="w-full h-full object-cover" /></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                      <span className="text-sm font-bold text-orange-600">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-50 space-y-4">
                <div className="space-y-3">
                  <input type="text" placeholder="Seu nome" className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-orange-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <textarea placeholder="Endereço de entrega" className="w-full bg-white border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-orange-600 h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="font-bold text-slate-900 text-lg">Total</span>
                  <span className="font-black text-slate-900 text-2xl">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <button onClick={sendToWhatsApp} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-orange-600/20 active:scale-95 transition-all">
                  Finalizar Pedido <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

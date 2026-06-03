'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, X, Search, ArrowLeft, MessageCircle, Home as HomeIcon, UtensilsCrossed, ClipboardList, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function MenuPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [cart, setCart] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [itemQuantity, setItemQuantity] = useState(1)
  const [selectedAddons, setSelectedAddons] = useState<any>({})
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', paymentMethod: 'Pix', change: '' })

  useEffect(() => {
    async function loadMenu() {
      const supabase = createClient()
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('created_at', { ascending: true }),
        supabase.from('products').select('*').order('created_at', { ascending: false })
      ])
      if (catRes.data) setCategories(catRes.data)
      if (prodRes.data) setProducts(prodRes.data)
      setLoading(false)
    }
    loadMenu()
  }, [])

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  const toggleAddon = (groupName: string, option: any) => {
    setSelectedAddons((prev: any) => {
      const currentGroup = prev[groupName] || []
      const isSelected = currentGroup.some((it: any) => it.name === option.name)
      
      if (isSelected) {
        return { ...prev, [groupName]: currentGroup.filter((it: any) => it.name !== option.name) }
      } else {
        return { ...prev, [groupName]: [...currentGroup, option] }
      }
    })
  }

  const calculateItemTotal = () => {
    if (!selectedProduct) return 0
    const addonsTotal = Object.values(selectedAddons).flat().reduce((acc: any, it: any) => acc + it.price, 0)
    return (selectedProduct.price + addonsTotal) * itemQuantity
  }

  const handleAddProduct = () => {
    const addonsPrice = Object.values(selectedAddons).flat().reduce((acc: any, it: any) => acc + it.price, 0)
    setCart(prev => [...prev, { 
      ...selectedProduct, 
      price: selectedProduct.price + addonsPrice,
      quantity: itemQuantity, 
      extras: selectedAddons 
    }])
    setSelectedProduct(null)
    setItemQuantity(1)
    setSelectedAddons({})
  }

  const sendToWhatsApp = () => {
    const orderId = Math.floor(1000 + Math.random() * 9000).toString();
    const itemsList = cart.map(item => {
      const extras = Object.entries(item.extras || {})
        .map(([group, opts]: any) => `  *${group}:* ${opts.map((o: any) => o.name).join(', ')}`)
        .join('\n');
      return `✅ *${item.quantity}x ${item.name}*\n${extras ? extras + '\n' : ''}   R$ ${(item.price * item.quantity).toFixed(2)}`;
    }).join('\n\n');

    let message = `*🍔 NOVO PEDIDO (#${orderId}) - KRIKASBURGUER*\n\n` +
      `👤 *Cliente:* ${formData.name}\n` +
      `📞 *WhatsApp:* ${formData.phone}\n` +
      `📍 *Endereço:* ${formData.address}\n\n` +
      `🛒 *Itens:*\n${itemsList}\n\n` +
      `--------------------------\n` +
      `💰 *Pagamento:* ${formData.paymentMethod}\n`;

    if (formData.paymentMethod === 'Dinheiro' && formData.change) {
      message += `💵 *Troco para:* R$ ${formData.change}\n`;
    }

    message += `🚀 *Total do Pedido:* R$ ${cartTotal.toFixed(2).replace('.', ',')}\n` +
      `--------------------------\n` +
      `⏰ Enviado às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;

    // Save to localStorage
    const newOrder = {
      id: orderId,
      date: new Date().toLocaleString('pt-BR'),
      status: 'Enviado',
      items: cart.map(it => `${it.quantity}x ${it.name}`).join(', '),
      total: cartTotal
    };
    const existingOrders = JSON.parse(localStorage.getItem('krikas_orders') || '[]');
    localStorage.setItem('krikas_orders', JSON.stringify([newOrder, ...existingOrders]));

    window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(message)}`, '_blank');
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-32">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-slate-600">Voltar</span>
          </Link>
          <div className="flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar no cardápio" className="w-full bg-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm outline-none" />
          </div>
          <div className="w-10" />
        </div>
      </header>

      {/* Store Info */}
      <div className="bg-white px-4 pt-6 pb-4 max-w-5xl mx-auto border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full border border-slate-100 shadow-sm overflow-hidden flex-shrink-0">
            <img src="https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-1">
            <h1 className="text-2xl font-bold text-slate-900">KrikasBurguer</h1>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold uppercase tracking-wider">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Aberto agora
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-slate-500">Hoje: 18:00 - 23:00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Category Bar for Mobile/Desktop Navigation */}
      <div className="sticky top-16 bg-white border-b border-slate-100 z-40 overflow-x-auto no-scrollbar shadow-sm">
        <div className="max-w-5xl mx-auto px-4 flex gap-8 h-14 items-center whitespace-nowrap">
          {categories.map((cat) => (
            <a 
              key={cat.id} 
              href={`#${cat.id}`}
              className="text-sm font-bold text-slate-500 hover:text-red-600 active:text-red-600 transition-colors"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <p className="font-medium">Carregando cardápio...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <p className="font-medium">Nenhum lanche cadastrado ainda.</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryProducts = products.filter(p => p.category_id === category.id);
            if (categoryProducts.length === 0) return null;
            return (
              <div key={category.id} id={category.id} className="mb-12 scroll-mt-32">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-slate-900">{category.name}</h2>
                  <div className="w-12 h-1 bg-red-600 mt-2" />
                </div>
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 md:gap-y-8">
                  {categoryProducts.map((product) => (
                    <div 
                      key={product.id} 
                      onClick={() => setSelectedProduct(product)} 
                      className="flex items-start gap-4 py-4 md:pb-8 border-b border-slate-100 cursor-pointer active:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 space-y-1">
                        <h3 className="text-[15px] font-medium text-slate-800">{product.name}</h3>
                        <p className="text-xs text-slate-500 line-clamp-2">{product.description}</p>
                        <div className="pt-2 text-sm font-medium text-emerald-600">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                      </div>
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🍔</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Product Modal */}
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
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-50 bg-white p-2 rounded-full shadow-lg">
                <X className="w-5 h-5 text-slate-900" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto bg-slate-100 overflow-hidden flex items-center justify-center">
                {selectedProduct.image_url ? (
                  <img src={selectedProduct.image_url} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-6xl">🍔</span>
                )}
              </div>

              <div className="w-full md:w-1/2 flex flex-col h-full md:max-h-[90vh]">
                <div className="p-8 overflow-y-auto flex-1 no-scrollbar space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedProduct.name}</h2>
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{selectedProduct.description}</p>
                    <div className="text-xl font-bold text-slate-900 mt-4">R$ {selectedProduct.price.toFixed(2).replace('.', ',')}</div>
                  </div>

                  {selectedProduct.addonGroups?.map((group: any) => (
                    <div key={group.name}>
                      <div className="bg-slate-50 px-8 py-3 border-y border-slate-100 flex justify-between items-center -mx-8">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{group.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase font-bold">{group.required ? 'Obrigatório' : 'Opcional'}</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-4">
                        {group.options.map((opt: any) => {
                          const isSelected = selectedAddons[group.name]?.some((it: any) => it.name === opt.name)
                          return (
                            <div key={opt.name} onClick={() => toggleAddon(group.name, opt)} className="flex items-center justify-between cursor-pointer group">
                              <div className="flex items-center gap-3">
                                {opt.image && <img src={opt.image} className="w-12 h-12 rounded-lg object-cover" />}
                                <div className="flex flex-col">
                                  <span className="text-sm text-slate-700 group-hover:text-red-600 transition-colors">{opt.name}</span>
                                  {opt.price > 0 && <span className="text-xs text-emerald-600">+ R$ {opt.price.toFixed(2)}</span>}
                                </div>
                              </div>
                              <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center transition-all ${isSelected ? 'border-red-600 bg-red-600' : 'border-slate-200'}`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 border-t border-slate-100 bg-white flex items-center gap-4">
                  <div className="flex items-center gap-4 border border-slate-200 rounded-xl p-2 h-12">
                    <button onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))} className="p-1"><Minus className="w-5 h-5 text-red-600" /></button>
                    <span className="font-bold w-6 text-center text-lg">{itemQuantity}</span>
                    <button onClick={() => setItemQuantity(itemQuantity + 1)} className="p-1"><Plus className="w-5 h-5 text-red-600" /></button>
                  </div>
                  <button onClick={handleAddProduct} className="flex-1 bg-red-600 text-white h-12 rounded-xl font-bold flex items-center justify-between px-8 shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                    <span>Adicionar</span>
                    <span>R$ {calculateItemTotal().toFixed(2).replace('.', ',')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Sacola */}
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
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-1"><ArrowLeft className="w-5 h-5 text-red-600" /></button>
                  <h2 className="text-lg font-bold text-slate-900">Sua sacola</h2>
                </div>
                <button onClick={() => setCart([])} className="text-xs font-bold text-red-600 uppercase">Limpar</button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                {cart.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="text-4xl">🛒</div>
                    <p className="text-slate-500">Sua sacola está vazia</p>
                    <button onClick={() => setIsCheckoutOpen(false)} className="text-red-600 font-bold">Voltar ao cardápio</button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {cart.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 pb-6 border-b border-slate-50 last:border-0">
                          <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            {item.image_url ? (
                              <img src={item.image_url} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-2xl">🍔</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                              <span className="text-sm font-bold text-slate-900">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center gap-3 border border-slate-200 rounded-lg px-2 py-1">
                                <button onClick={() => {
                                  setCart(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, it.quantity - 1) } : it))
                                }}><Minus className="w-3 h-3 text-red-600" /></button>
                                <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                                <button onClick={() => {
                                  setCart(prev => prev.map((it, i) => i === idx ? { ...it, quantity: it.quantity + 1 } : it))
                                }}><Plus className="w-3 h-3 text-red-600" /></button>
                              </div>
                              <button onClick={() => setCart(prev => prev.filter((_, i) => i !== idx))} className="text-[10px] text-slate-400 font-bold uppercase">Remover</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-100">
                      <div className="flex justify-between text-sm text-slate-500"><span>Subtotal</span><span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span></div>
                      <div className="flex justify-between text-sm text-slate-500"><span>Taxa de entrega</span><span className="text-emerald-600 font-bold">Grátis</span></div>
                      <div className="flex justify-between text-lg font-bold text-slate-900 pt-2"><span>Total</span><span>R$ {cartTotal.toFixed(2).replace('.', ',')}</span></div>
                    </div>

                    <div className="space-y-4 pt-6">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest text-[10px]">Dados de entrega</h3>
                      <div className="space-y-3">
                        <input type="text" placeholder="Seu nome" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-600" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input type="tel" placeholder="WhatsApp (DDD + Número)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-600" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <textarea placeholder="Endereço completo (Rua, Número, Bairro)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-red-600 h-24" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                        
                        <div className="pt-2">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-3">Forma de Pagamento</span>
                          <div className="grid grid-cols-3 gap-2">
                            {['Pix', 'Cartão', 'Dinheiro'].map(method => (
                              <button key={method} onClick={() => setFormData({...formData, paymentMethod: method})} className={`p-3 rounded-xl border text-[10px] font-bold transition-all ${formData.paymentMethod === method ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-white border-slate-100 text-slate-500'}`}>{method}</button>
                            ))}
                          </div>
                        </div>

                        {formData.paymentMethod === 'Dinheiro' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="pt-2">
                            <input 
                              type="text" 
                              placeholder="Precisa de troco para quanto? (Ex: R$ 50,00)" 
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none focus:border-emerald-600" 
                              value={formData.change} 
                              onChange={e => setFormData({...formData, change: e.target.value})} 
                            />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <button onClick={sendToWhatsApp} disabled={cart.length === 0} className="w-full bg-red-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 active:scale-95 transition-all">
                  Enviar Pedido <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation & Cart Bar Container */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Floating Cart Bar (Appears above Bottom Nav) */}
        {cartCount > 0 && !isCheckoutOpen && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }}
            className="bg-white border-t border-slate-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] mx-4 mb-4 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Total</span>
                <span className="text-xl font-bold text-slate-900">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(true)} 
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold text-sm shadow-lg shadow-red-600/20"
              >
                Ver sacola ({cartCount})
              </button>
            </div>
          </motion.div>
        )}

        {/* Bottom Navigation Bar */}
        <nav className="md:hidden bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center pb-safe">
          <Link href="/" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Início</span>
          </Link>
          <Link href="/menu" className="flex flex-col items-center gap-1 text-red-600">
            <UtensilsCrossed className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cardápio</span>
          </Link>
          <Link href="/pedidos" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <ClipboardList className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Pedidos</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}

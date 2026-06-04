'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, GripVertical, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Reorder } from 'framer-motion'
import Link from 'next/link'

export default function AdminCardapio() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('products').select('*').order('created_at', { ascending: false })
    ])
    if (catRes.data) setCategories(catRes.data)
    if (prodRes.data) setProducts(prodRes.data)
    setLoading(false)
  }

  // ==== CATEGORIAS ====
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault()
    if (!newCategoryName) return
    setIsAddingCategory(true)
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order || 0)) + 1 : 0
    const { data, error } = await supabase.from('categories').insert([{ name: newCategoryName, sort_order: nextOrder }]).select()
    if (error) { alert('Erro ao criar categoria: ' + error.message); console.error(error) }
    if (data) setCategories([...categories, data[0]])
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Tem certeza? Isso apagará todos os produtos desta categoria!')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  async function handleReorderCategories(newOrder: any[]) {
    setCategories(newOrder)
    const updates = newOrder.map((cat, index) => ({ ...cat, sort_order: index }))
    await supabase.from('categories').upsert(updates)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Cardápio Ativo</h2>
          <p className="text-slate-500 text-sm mt-1">Visualize como os produtos estão organizados por categorias no seu cardápio.</p>
        </div>
        <Link
          href="/admin/produtos"
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 transition-colors flex-shrink-0"
        >
          <ExternalLink className="w-5 h-5" />
          Gerenciar Produtos
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Categorias com Drag & Drop */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input type="text" placeholder="Ex: Smashs, Bebidas..." className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-600 text-slate-900" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} required />
              <button disabled={isAddingCategory} className="bg-slate-900 text-white px-4 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors">
                {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>
            <div className="space-y-2">
              <Reorder.Group axis="y" values={categories} onReorder={handleReorderCategories} className="space-y-2">
                {categories.map(cat => (
                  <Reorder.Item key={cat.id} value={cat} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 cursor-grab active:cursor-grabbing shadow-sm">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      <span className="text-sm font-bold text-slate-700">{cat.name}</span>
                    </div>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-500 p-1 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              {categories.length === 0 && <p className="text-xs text-slate-400 text-center py-4">Nenhuma categoria criada.</p>}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center mt-4">Pressione e arraste para ordenar</p>
          </div>
        </div>

        {/* Painel Direito: Lista visual do cardápio separada por categorias */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Visão Geral do Cardápio</h3>
            
            {categories.length === 0 && (
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-500 text-sm">Crie categorias para organizar seu cardápio.</p>
              </div>
            )}

            <div className="space-y-8">
              {categories.map(cat => {
                const catProducts = products.filter(p => p.category_id === cat.id)
                return (
                  <div key={cat.id} className="space-y-3">
                    <h4 className="font-bold text-slate-800 text-md border-b-2 border-red-600 pb-2 inline-block">
                      {cat.name} <span className="text-xs text-slate-400 ml-2">({catProducts.length})</span>
                    </h4>
                    
                    {catProducts.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">Nenhum produto nesta categoria.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {catProducts.map(prod => (
                          <div key={prod.id} className="flex gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                            <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {prod.image_url ? (
                                <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-2xl">🍔</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="font-bold text-slate-800 text-sm truncate">{prod.name}</p>
                              <p className="text-emerald-600 font-black text-sm">R$ {prod.price?.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

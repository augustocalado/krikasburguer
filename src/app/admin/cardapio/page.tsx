'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Image as ImageIcon, UploadCloud, GripVertical } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Reorder } from 'framer-motion'

export default function AdminCardapio() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
    cost_price: '',
    price: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

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
    
    // Pega o maior sort_order atual e soma 1
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order || 0)) + 1 : 0
    
    const { data, error } = await supabase.from('categories').insert([{ 
      name: newCategoryName,
      sort_order: nextOrder 
    }]).select()
    
    if (error) {
      alert('Erro ao criar categoria: ' + error.message)
      console.error(error)
    }
    
    if (data) setCategories([...categories, data[0]])
    
    setNewCategoryName('')
    setIsAddingCategory(false)
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm('Tem certeza? Isso apagará todos os produtos desta categoria!')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchData()
  }

  // ==== DRAG AND DROP (CATEGORIAS) ====
  async function handleReorderCategories(newOrder: any[]) {
    // Atualiza a tela imediatamente para ficar responsivo
    setCategories(newOrder)

    // Prepara a lista de atualizações no banco de dados
    const updates = newOrder.map((cat, index) => ({
      ...cat,
      sort_order: index
    }))

    // Envia tudo pro Supabase (o upsert é usado para atualizar múltiplas linhas de uma vez)
    await supabase.from('categories').upsert(updates)
  }

  // ==== UPLOAD DE IMAGEM ====
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    // Faz o upload pro bucket "products"
    const { error } = await supabase.storage.from('products').upload(filePath, file)
    
    if (error) {
      alert('Erro ao enviar imagem. Verifique se você rodou o código SQL no Supabase!')
      console.error(error)
    } else {
      // Pega o link público da foto recém enviada
      const { data } = supabase.storage.from('products').getPublicUrl(filePath)
      setProductForm({ ...productForm, image_url: data.publicUrl })
    }
    
    setUploadingImage(false)
  }

  // ==== PRODUTOS ====
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setIsAddingProduct(true)
    
    const { data, error } = await supabase.from('products').insert([{
      name: productForm.name,
      description: productForm.description,
      image_url: productForm.image_url,
      category_id: productForm.category_id,
      cost_price: parseFloat(productForm.cost_price.replace(',', '.')),
      price: parseFloat(productForm.price.replace(',', '.'))
    }]).select()

    if (data) {
      setProducts([data[0], ...products])
      setIsAddingProduct(false)
      setProductForm({ name: '', description: '', image_url: '', category_id: '', cost_price: '', price: '' })
    } else if (error) {
      alert('Erro ao cadastrar: ' + error.message)
      setIsAddingProduct(false)
    }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja apagar este lanche?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  // Cálculos dinâmicos
  const cost = parseFloat(productForm.cost_price.replace(',', '.')) || 0
  const price = parseFloat(productForm.price.replace(',', '.')) || 0
  const profit = price - cost
  const margin = price > 0 ? (profit / price) * 100 : 0

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Gestão do Cardápio</h2>
          <p className="text-slate-500 text-sm mt-1">Cadastre os lanches, faça upload das fotos e arraste as categorias para ordenar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Categorias com Drag & Drop */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Categorias</h3>
            
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Ex: Smashs, Bebidas..." 
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-red-600 text-slate-900"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                required
              />
              <button disabled={isAddingCategory} className="bg-slate-900 text-white px-4 rounded-xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-colors">
                {isAddingCategory ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </form>

            <div className="space-y-2">
              <Reorder.Group axis="y" values={categories} onReorder={handleReorderCategories} className="space-y-2">
                {categories.map(cat => (
                  <Reorder.Item key={cat.id} value={cat} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-grab active:cursor-grabbing shadow-sm bg-white">
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

        {/* Painel Direito: Novo Produto e Lista */}
        <div className="lg:col-span-2 space-y-6">
          {/* Form de Produto */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Cadastrar Novo Produto</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Lanche</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600 text-slate-900" placeholder="Ex: Krikas Duplo" />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Categoria</label>
                  <select required value={productForm.category_id} onChange={e => setProductForm({...productForm, category_id: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600 text-slate-900">
                    <option value="">Selecione...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Descrição</label>
                  <textarea value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-red-600 text-slate-900 h-20" placeholder="Ingredientes e detalhes..." />
                </div>
                
                {/* UPLOAD DE IMAGEM */}
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Foto do Lanche</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden flex-shrink-0">
                      {uploadingImage ? (
                        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                      ) : productForm.image_url ? (
                        <img src={productForm.image_url} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <label className="w-full bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors">
                        <UploadCloud className="w-5 h-5 text-slate-500 mb-1" />
                        <span className="text-xs font-bold text-slate-600">Clique para escolher do PC/Celular</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Bloco Financeiro / CMV */}
                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl text-white mt-2">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Preço Custo (R$)</label>
                    <input type="text" required value={productForm.cost_price} onChange={e => setProductForm({...productForm, cost_price: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm outline-none text-white" placeholder="Ex: 8.50" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Preço Venda (R$)</label>
                    <input type="text" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm outline-none font-bold text-emerald-400" placeholder="Ex: 25.00" />
                  </div>
                  <div className="col-span-2 md:col-span-2 flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lucro Bruto</p>
                      <p className={`text-lg font-black ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {profit.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Margem (%)</p>
                      <p className={`text-lg font-black ${margin > 30 ? 'text-emerald-400' : 'text-amber-400'}`}>{margin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <button disabled={isAddingProduct || categories.length === 0 || uploadingImage} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center">
                {isAddingProduct ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cadastrar Produto'}
              </button>
            </form>
          </div>

          {/* Lista de Produtos Cadastrados */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Seus Produtos ({products.length})</h3>
            {products.map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {prod.image_url ? <img src={prod.image_url} className="w-full h-full object-cover" /> : <span className="text-2xl">🍔</span>}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <div className="flex gap-4 mt-1 text-xs font-medium">
                    <span className="text-slate-500">Custo: R$ {prod.cost_price}</span>
                    <span className="text-emerald-600">Venda: R$ {prod.price}</span>
                    <span className="text-blue-600 bg-blue-50 px-2 rounded-full hidden md:inline">
                      Lucro: R$ {(prod.price - prod.cost_price).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDeleteProduct(prod.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                <p className="text-slate-500">Nenhum produto cadastrado ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

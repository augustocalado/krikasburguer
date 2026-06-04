'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Image as ImageIcon, UploadCloud, GripVertical, ChevronDown, ChevronUp, Sparkles, FileSpreadsheet, Download, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Reorder } from 'framer-motion'
import * as XLSX from 'xlsx'

export default function AdminCardapio() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [isAddingCategory, setIsAddingCategory] = useState(false)

  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showIngredients, setShowIngredients] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<{ id: string; name: string; cost: number; qty: number }[]>([])
  const [desiredMargin, setDesiredMargin] = useState('70')

  // Excel Import States
  const [showImport, setShowImport] = useState(false)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [importDone, setImportDone] = useState(false)

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    image_url: '',
    category_id: '',
    cost_price: '',
    price: ''
  })

  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [catRes, prodRes, ingRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('ingredients').select('*').order('name', { ascending: true })
    ])
    if (catRes.data) setCategories(catRes.data)
    if (prodRes.data) setProducts(prodRes.data)
    if (ingRes.data) setIngredients(ingRes.data)
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

  // ==== UPLOAD DE IMAGEM ====
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
    const { error } = await supabase.storage.from('products').upload(fileName, file)
    if (error) { alert('Erro ao enviar imagem. Verifique se você rodou o código SQL no Supabase!'); console.error(error) }
    else {
      const { data } = supabase.storage.from('products').getPublicUrl(fileName)
      setProductForm({ ...productForm, image_url: data.publicUrl })
    }
    setUploadingImage(false)
  }

  // ==== FICHA TÉCNICA / INGREDIENTES ====
  function toggleIngredient(ing: any) {
    const exists = selectedIngredients.find(i => i.id === ing.id)
    if (exists) {
      const updated = selectedIngredients.filter(i => i.id !== ing.id)
      setSelectedIngredients(updated); recalcCost(updated)
    } else {
      const updated = [...selectedIngredients, { id: ing.id, name: ing.name, cost: parseFloat(ing.cost), qty: 1 }]
      setSelectedIngredients(updated); recalcCost(updated)
    }
  }

  function updateIngQty(id: string, qty: number) {
    const updated = selectedIngredients.map(i => i.id === id ? { ...i, qty } : i)
    setSelectedIngredients(updated); recalcCost(updated)
  }

  function recalcCost(ings: { cost: number; qty: number }[]) {
    const total = ings.reduce((acc, i) => acc + (i.cost * i.qty), 0)
    const margin = parseFloat(desiredMargin) || 70
    const suggestedPrice = total / (1 - margin / 100)
    setProductForm(f => ({ ...f, cost_price: total.toFixed(2), price: suggestedPrice.toFixed(2) }))
  }

  function applyMarginSuggestion() {
    const cost = parseFloat(productForm.cost_price) || 0
    const margin = parseFloat(desiredMargin) || 70
    const suggestedPrice = cost / (1 - margin / 100)
    setProductForm(f => ({ ...f, price: suggestedPrice.toFixed(2) }))
  }

  // ==== IMPORTAÇÃO DE EXCEL ====
  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['nome', 'categoria', 'descricao', 'preco_custo', 'preco_venda'],
      ['Krikas Duplo Smash', 'Smashs', 'Dois blends de 70g com cheddar', '8.50', '25.00'],
      ['Coca-Cola 350ml', 'Bebidas', 'Lata gelada', '2.50', '6.00'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Produtos')
    XLSX.writeFile(wb, 'modelo_importacao_krikas.xlsx')
  }

  function handleExcelFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImportErrors([])
    setImportPreview([])
    setImportDone(false)

    const reader = new FileReader()
    reader.onload = (ev) => {
      const data = new Uint8Array(ev.target?.result as ArrayBuffer)
      const wb = XLSX.read(data, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' })

      const errors: string[] = []
      const preview = rows.map((row, i) => {
        const name = String(row['nome'] || row['Nome'] || row['NOME'] || '').trim()
        const categoria = String(row['categoria'] || row['Categoria'] || row['CATEGORIA'] || '').trim()
        const descricao = String(row['descricao'] || row['Descrição'] || row['descricao'] || '').trim()
        const preco_custo = parseFloat(String(row['preco_custo'] || row['Preço Custo'] || row['custo'] || '0').replace(',', '.'))
        const preco_venda = parseFloat(String(row['preco_venda'] || row['Preço Venda'] || row['preco'] || '0').replace(',', '.'))

        if (!name) errors.push(`Linha ${i + 2}: Nome em branco`)
        if (!categoria) errors.push(`Linha ${i + 2}: Categoria em branco`)
        if (isNaN(preco_custo)) errors.push(`Linha ${i + 2}: Preço de custo inválido`)
        if (isNaN(preco_venda)) errors.push(`Linha ${i + 2}: Preço de venda inválido`)

        return { name, categoria, descricao, preco_custo, preco_venda, valid: !!name && !!categoria }
      }).filter(r => r.name)

      setImportErrors(errors)
      setImportPreview(preview)
    }
    reader.readAsArrayBuffer(file)
    // Reset input
    e.target.value = ''
  }

  async function handleImport() {
    if (importPreview.length === 0) return
    setImporting(true)

    const validRows = importPreview.filter(r => r.valid)

    // 1. Encontrar ou criar as categorias necessárias
    const uniqueCategories = [...new Set(validRows.map(r => r.categoria))]
    let currentCategories = [...categories]

    for (const catName of uniqueCategories) {
      const exists = currentCategories.find(c => c.name.toLowerCase() === catName.toLowerCase())
      if (!exists) {
        const nextOrder = currentCategories.length > 0 ? Math.max(...currentCategories.map(c => c.sort_order || 0)) + 1 : 0
        const { data } = await supabase.from('categories').insert([{ name: catName, sort_order: nextOrder }]).select()
        if (data) currentCategories = [...currentCategories, data[0]]
      }
    }

    // 2. Inserir todos os produtos
    const toInsert = validRows.map(row => {
      const cat = currentCategories.find(c => c.name.toLowerCase() === row.categoria.toLowerCase())
      return {
        name: row.name,
        description: row.descricao,
        category_id: cat?.id || null,
        cost_price: row.preco_custo || 0,
        price: row.preco_venda || 0,
        image_url: null
      }
    })

    const { error } = await supabase.from('products').insert(toInsert)

    if (error) {
      alert('Erro ao importar: ' + error.message)
    } else {
      setImportDone(true)
      setImportPreview([])
      fetchData()
    }

    setImporting(false)
  }

  // ==== PRODUTOS ====
  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    setIsAddingProduct(true)
    const { data, error } = await supabase.from('products').insert([{
      name: productForm.name, description: productForm.description, image_url: productForm.image_url,
      category_id: productForm.category_id,
      cost_price: parseFloat(productForm.cost_price.replace(',', '.')),
      price: parseFloat(productForm.price.replace(',', '.'))
    }]).select()
    if (data) {
      setProducts([data[0], ...products]); setIsAddingProduct(false)
      setProductForm({ name: '', description: '', image_url: '', category_id: '', cost_price: '', price: '' })
      setSelectedIngredients([])
    } else if (error) { alert('Erro ao cadastrar: ' + error.message); setIsAddingProduct(false) }
  }

  async function handleDeleteProduct(id: string) {
    if (!confirm('Tem certeza que deseja apagar este lanche?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  const cost = parseFloat(productForm.cost_price.replace(',', '.')) || 0
  const price = parseFloat(productForm.price.replace(',', '.')) || 0
  const profit = price - cost
  const margin = price > 0 ? (profit / price) * 100 : 0

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Gestão do Cardápio</h2>
          <p className="text-slate-500 text-sm mt-1">Cadastre os lanches, faça upload das fotos e arraste as categorias para ordenar.</p>
        </div>
        <button
          onClick={() => { setShowImport(!showImport); setImportDone(false) }}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-colors flex-shrink-0"
        >
          <FileSpreadsheet className="w-5 h-5" />
          Importar Excel
        </button>
      </div>

      {/* ==== PAINEL DE IMPORTAÇÃO ==== */}
      {showImport && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-emerald-50">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              Importar Produtos do Excel
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Faça o download do modelo, preencha sua planilha e importe. As categorias novas serão criadas automaticamente!
            </p>
          </div>

          <div className="p-6 space-y-5">
            {/* Step 1 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">1</div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 mb-2">Baixe o modelo da planilha</p>
                <button onClick={downloadTemplate} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                  <Download className="w-4 h-4" />
                  Baixar modelo_importacao_krikas.xlsx
                </button>
                <p className="text-xs text-slate-500 mt-2">Colunas: <strong>nome | categoria | descricao | preco_custo | preco_venda</strong></p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">2</div>
              <div className="flex-1">
                <p className="font-bold text-slate-800 mb-2">Selecione sua planilha preenchida</p>
                <label className="flex items-center gap-3 bg-emerald-50 border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-4 cursor-pointer transition-colors">
                  <UploadCloud className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700">Clique para selecionar o arquivo</p>
                    <p className="text-xs text-emerald-600">Aceita .xlsx e .xls</p>
                  </div>
                  <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleExcelFile} />
                </label>
              </div>
            </div>

            {/* Erros */}
            {importErrors.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Avisos encontrados ({importErrors.length})
                </p>
                {importErrors.map((err, i) => <p key={i} className="text-xs text-amber-700">• {err}</p>)}
              </div>
            )}

            {/* Preview */}
            {importPreview.length > 0 && (
              <div className="space-y-3">
                <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {importPreview.filter(r => r.valid).length} produto(s) prontos para importar:
                </p>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 sticky top-0">
                      <tr>
                        <th className="p-3 text-left font-bold text-slate-500">Nome</th>
                        <th className="p-3 text-left font-bold text-slate-500">Categoria</th>
                        <th className="p-3 text-right font-bold text-slate-500">Custo</th>
                        <th className="p-3 text-right font-bold text-slate-500">Venda</th>
                        <th className="p-3 text-center font-bold text-slate-500">OK?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {importPreview.map((row, i) => (
                        <tr key={i} className={row.valid ? 'bg-white' : 'bg-red-50'}>
                          <td className="p-3 font-medium text-slate-800">{row.name || '—'}</td>
                          <td className="p-3 text-slate-600">{row.categoria || '—'}</td>
                          <td className="p-3 text-right text-slate-600">R$ {row.preco_custo?.toFixed(2)}</td>
                          <td className="p-3 text-right font-bold text-emerald-600">R$ {row.preco_venda?.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            {row.valid ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-red-500 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  onClick={handleImport}
                  disabled={importing || importPreview.filter(r => r.valid).length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {importing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
                  {importing ? 'Importando...' : `Confirmar e Importar ${importPreview.filter(r => r.valid).length} Produtos`}
                </button>
              </div>
            )}

            {importDone && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800">Importação concluída com sucesso!</p>
                  <p className="text-sm text-emerald-700">Todos os produtos foram adicionados ao seu cardápio.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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

        {/* Painel Direito: Novo Produto e Lista */}
        <div className="lg:col-span-2 space-y-6">
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
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 mb-1">Foto do Lanche</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden flex-shrink-0">
                      {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin text-slate-400" /> : productForm.image_url ? <img src={productForm.image_url} className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-slate-400" />}
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

                {ingredients.length > 0 && (
                  <div className="col-span-2">
                    <button type="button" onClick={() => setShowIngredients(!showIngredients)} className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 hover:bg-amber-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-bold">Calcular Custo pela Ficha Técnica</span>
                        {selectedIngredients.length > 0 && <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{selectedIngredients.length}</span>}
                      </div>
                      {showIngredients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showIngredients && (
                      <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
                        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                          {ingredients.map(ing => {
                            const sel = selectedIngredients.find(i => i.id === ing.id)
                            return (
                              <div key={ing.id} className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${sel ? 'bg-white border-amber-400 shadow-sm' : 'bg-white/50 border-transparent hover:border-amber-200'}`}>
                                <input type="checkbox" checked={!!sel} onChange={() => toggleIngredient(ing)} className="w-4 h-4 accent-red-600 cursor-pointer" />
                                <div className="flex-1" onClick={() => toggleIngredient(ing)}>
                                  <p className="text-sm font-bold text-slate-800">{ing.name}</p>
                                  <p className="text-xs text-slate-500">R$ {parseFloat(ing.cost).toFixed(2)} / {ing.unit}</p>
                                </div>
                                {sel && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-slate-500 font-bold">Qtd:</span>
                                    <input type="number" min="0" step="0.001" className="w-20 bg-white border border-slate-200 rounded-lg p-1 text-xs text-center text-slate-900 outline-none" value={sel.qty} onChange={e => updateIngQty(ing.id, parseFloat(e.target.value) || 0)} />
                                    <span className="text-xs font-bold text-emerald-600">= R$ {(sel.cost * sel.qty).toFixed(2)}</span>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        {selectedIngredients.length > 0 && (
                          <div className="pt-3 border-t border-amber-200 flex items-end gap-3 flex-wrap">
                            <div>
                              <label className="block text-xs font-bold text-amber-700 mb-1">Margem desejada (%)</label>
                              <input type="number" min="1" max="99" className="w-24 bg-white border border-amber-300 rounded-lg p-2 text-sm text-slate-900 outline-none" value={desiredMargin} onChange={e => setDesiredMargin(e.target.value)} />
                            </div>
                            <button type="button" onClick={applyMarginSuggestion} className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-amber-700 transition-colors">
                              <Sparkles className="w-4 h-4" />
                              Sugerir Preço de Venda
                            </button>
                            <div className="text-xs text-amber-700 font-medium">
                              Custo total: <strong>R$ {selectedIngredients.reduce((a, i) => a + i.cost * i.qty, 0).toFixed(2)}</strong>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900 p-4 rounded-xl text-white mt-2">
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Preço Custo (R$)</label>
                    <input type="text" required value={productForm.cost_price} onChange={e => setProductForm({...productForm, cost_price: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm outline-none text-white" placeholder="Ex: 8.50" />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1">Preço Venda (R$)</label>
                    <input type="text" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-slate-800 border-none rounded-lg p-2 text-sm outline-none font-bold text-emerald-400" placeholder="Ex: 25.00" />
                  </div>
                  <div className="col-span-2 md:col-span-2 grid grid-cols-2 gap-2 bg-slate-800/50 rounded-lg p-3">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Custo Receita</p>
                      <p className="text-sm font-black text-slate-200">R$ {parseFloat(productForm.cost_price || '0').toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">CMV (%)</p>
                      <p className={`text-sm font-black ${productForm.price && parseFloat(productForm.price) > 0 ? ((parseFloat(productForm.cost_price || '0') / parseFloat(productForm.price)) * 100) <= 35 ? 'text-emerald-400' : 'text-amber-400' : 'text-slate-500'}`}>
                        {productForm.price && parseFloat(productForm.price) > 0 ? ((parseFloat(productForm.cost_price || '0') / parseFloat(productForm.price)) * 100).toFixed(1) : '0.0'}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lucro Bruto</p>
                      <p className={`text-sm font-black ${profit > 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {profit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Margem (%)</p>
                      <p className={`text-sm font-black ${margin >= 40 ? 'text-emerald-400' : 'text-amber-400'}`}>{margin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
              <button disabled={isAddingProduct || categories.length === 0 || uploadingImage} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors disabled:opacity-50 mt-4 flex items-center justify-center">
                {isAddingProduct ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cadastrar Produto'}
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Seus Produtos ({products.length})</h3>
            {products.map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  {prod.image_url ? <img src={prod.image_url} className="w-full h-full object-cover" /> : <span className="text-2xl">🍔</span>}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{prod.name}</h4>
                  <div className="flex gap-4 mt-1 text-xs font-medium flex-wrap">
                    <span className="text-slate-500">Custo: R$ {prod.cost_price}</span>
                    <span className="text-emerald-600">Venda: R$ {prod.price}</span>
                    <span className="text-blue-600 bg-blue-50 px-2 rounded-full">Lucro: R$ {(prod.price - prod.cost_price).toFixed(2)}</span>
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

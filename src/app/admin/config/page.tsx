'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Loader2, Package, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const UNITS = ['un', 'g', 'kg', 'ml', 'L', 'fatia', 'folha', 'colher']

export default function AdminConfig() {
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({ name: '', unit: 'un', cost: '' })
  const [adding, setAdding] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchIngredients()
  }, [])

  async function fetchIngredients() {
    setLoading(true)
    const { data } = await supabase.from('ingredients').select('*').order('name', { ascending: true })
    if (data) setIngredients(data)
    setLoading(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)

    const { data, error } = await supabase.from('ingredients').insert([{
      name: form.name,
      unit: form.unit,
      cost: parseFloat(form.cost.replace(',', '.'))
    }]).select()

    if (error) {
      alert('Erro: ' + error.message)
    } else if (data) {
      setIngredients([...ingredients, data[0]].sort((a, b) => a.name.localeCompare(b.name)))
      setForm({ name: '', unit: 'un', cost: '' })
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apagar este ingrediente?')) return
    await supabase.from('ingredients').delete().eq('id', id)
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  async function handleUpdateCost(id: string, newCost: string) {
    const updated = ingredients.map(i => i.id === id ? { ...i, cost: newCost } : i)
    setIngredients(updated)
  }

  async function handleSaveCost(id: string, cost: string) {
    setSaving(true)
    await supabase.from('ingredients').update({ cost: parseFloat(cost.replace(',', '.')) }).eq('id', id)
    setSaving(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></div>
  }

  return (
    <div className="space-y-8 pb-32">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Ficha Técnica de Ingredientes</h2>
        <p className="text-slate-500 text-sm mt-1">
          Cadastre seus ingredientes com custo. Ao criar um produto, selecione os ingredientes e o sistema 
          calculará automaticamente o custo e sugerirá um preço de venda!
        </p>
      </div>

      {/* Formulário de Novo Ingrediente */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-red-600" />
          Adicionar Ingrediente
        </h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Ingrediente</label>
            <input
              type="text"
              required
              placeholder="Ex: Hamburguer 150g, Queijo Cheddar..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Unidade</label>
            <select
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
              value={form.unit}
              onChange={e => setForm({ ...form, unit: e.target.value })}
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Custo (R$)</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Ex: 2.50"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
                value={form.cost}
                onChange={e => setForm({ ...form, cost: e.target.value })}
              />
              <button
                disabled={adding}
                className="bg-red-600 text-white px-5 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors flex-shrink-0"
              >
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lista de Ingredientes */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Seus Ingredientes ({ingredients.length})</h3>
          {saving && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              Salvando...
            </div>
          )}
        </div>

        {ingredients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl m-6">
            Nenhum ingrediente cadastrado. Adicione acima!
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {/* Header */}
            <div className="grid grid-cols-12 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Ingrediente</div>
              <div className="col-span-2 text-center">Unidade</div>
              <div className="col-span-3 text-center">Custo (R$)</div>
              <div className="col-span-2 text-right">Ação</div>
            </div>

            {ingredients.map(ing => (
              <div key={ing.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-5">
                  <p className="font-semibold text-slate-800">{ing.name}</p>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg">{ing.unit}</span>
                </div>
                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm font-bold">R$</span>
                    <input
                      type="text"
                      className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-sm text-center text-slate-900 outline-none focus:border-red-600 font-mono"
                      value={ing.cost}
                      onChange={e => handleUpdateCost(ing.id, e.target.value)}
                      onBlur={e => handleSaveCost(ing.id, e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-span-2 flex justify-end">
                  <button
                    onClick={() => handleDelete(ing.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dica */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <p className="text-sm font-bold text-blue-800 mb-1">💡 Como usar</p>
        <p className="text-sm text-blue-700">
          Após cadastrar os ingredientes aqui, vá para <strong>Cardápio → Cadastrar Novo Produto</strong> e 
          selecione os ingredientes que compõem o lanche. O sistema vai somar os custos e 
          sugerir um preço de venda com sua margem de lucro desejada!
        </p>
      </div>
    </div>
  )
}

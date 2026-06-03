'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Loader2, Package, UploadCloud, Image as ImageIcon,
  MapPin, Clock, DollarSign, Store, Save, CheckCircle2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const UNITS = ['un', 'g', 'kg', 'ml', 'L', 'fatia', 'folha', 'colher']

const DAYS = [
  { key: 'seg', label: 'Segunda-feira' },
  { key: 'ter', label: 'Terça-feira' },
  { key: 'qua', label: 'Quarta-feira' },
  { key: 'qui', label: 'Quinta-feira' },
  { key: 'sex', label: 'Sexta-feira' },
  { key: 'sab', label: 'Sábado' },
  { key: 'dom', label: 'Domingo' },
]

const DEFAULT_HOURS = DAYS.reduce((acc, d) => ({
  ...acc,
  [d.key]: { open: true, from: '18:00', to: '23:00' }
}), {} as Record<string, { open: boolean; from: string; to: string }>)

const TABS = [
  { id: 'restaurante', label: 'Restaurante', icon: Store },
  { id: 'delivery', label: 'Delivery', icon: MapPin },
  { id: 'horarios', label: 'Horários', icon: Clock },
  { id: 'ingredientes', label: 'Ingredientes', icon: Package },
]

export default function AdminConfig() {
  const [activeTab, setActiveTab] = useState('restaurante')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  // Restaurant settings
  const [settings, setSettings] = useState({
    restaurant_name: 'Krikas Burguer',
    address: '',
    whatsapp: '',
    logo_url: '',
    delivery_fee: '5.00',
    delivery_fee_type: 'fixed', // fixed | free | variable
    min_order: '20.00',
    is_open_override: 'auto', // auto | open | closed
    business_hours: DEFAULT_HOURS,
  })

  // Ingredients
  const [ingredients, setIngredients] = useState<any[]>([])
  const [loadingIngs, setLoadingIngs] = useState(true)
  const [form, setForm] = useState({ name: '', unit: 'un', cost: '' })
  const [adding, setAdding] = useState(false)
  const [savingIng, setSavingIng] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    loadSettings()
    fetchIngredients()
  }, [])

  async function loadSettings() {
    const { data } = await supabase.from('restaurant_settings').select('*')
    if (data) {
      const map: Record<string, string> = {}
      data.forEach((r: any) => { map[r.key] = r.value })

      setSettings(prev => ({
        ...prev,
        restaurant_name: map['restaurant_name'] || prev.restaurant_name,
        address: map['address'] || '',
        whatsapp: map['whatsapp'] || '',
        logo_url: map['logo_url'] || '',
        delivery_fee: map['delivery_fee'] || '5.00',
        delivery_fee_type: map['delivery_fee_type'] || 'fixed',
        min_order: map['min_order'] || '20.00',
        is_open_override: map['is_open_override'] || 'auto',
        business_hours: map['business_hours'] ? JSON.parse(map['business_hours']) : DEFAULT_HOURS,
      }))
    }
  }

  async function saveSettings() {
    setSaving(true)
    setSaved(false)

    const entries = [
      { key: 'restaurant_name', value: settings.restaurant_name },
      { key: 'address', value: settings.address },
      { key: 'whatsapp', value: settings.whatsapp },
      { key: 'logo_url', value: settings.logo_url },
      { key: 'delivery_fee', value: settings.delivery_fee },
      { key: 'delivery_fee_type', value: settings.delivery_fee_type },
      { key: 'min_order', value: settings.min_order },
      { key: 'is_open_override', value: settings.is_open_override },
      { key: 'business_hours', value: JSON.stringify(settings.business_hours) },
    ]

    const { error } = await supabase.from('restaurant_settings').upsert(
      entries.map(e => ({ ...e, updated_at: new Date().toISOString() })),
      { onConflict: 'key' }
    )

    if (error) alert('Erro ao salvar: ' + error.message)
    else { setSaved(true); setTimeout(() => setSaved(false), 3000) }
    setSaving(false)
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `logo_${Date.now()}.${fileExt}`

    const { error } = await supabase.storage.from('products').upload(fileName, file, { upsert: true })
    if (error) { alert('Erro ao enviar logo: ' + error.message); console.error(error) }
    else {
      const { data } = supabase.storage.from('products').getPublicUrl(fileName)
      setSettings(s => ({ ...s, logo_url: data.publicUrl }))
    }
    setUploadingLogo(false)
    e.target.value = ''
  }

  function updateHours(day: string, field: string, value: any) {
    setSettings(s => ({
      ...s,
      business_hours: {
        ...s.business_hours,
        [day]: { ...s.business_hours[day], [field]: value }
      }
    }))
  }

  // Check if currently open based on schedule
  function isCurrentlyOpen(): boolean {
    if (settings.is_open_override === 'open') return true
    if (settings.is_open_override === 'closed') return false

    const now = new Date()
    const dayKeys = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    const todayKey = dayKeys[now.getDay()]
    const todayHours = settings.business_hours[todayKey]

    if (!todayHours?.open) return false

    const [fromH, fromM] = todayHours.from.split(':').map(Number)
    const [toH, toM] = todayHours.to.split(':').map(Number)
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    const fromMinutes = fromH * 60 + fromM
    const toMinutes = toH * 60 + toM

    return nowMinutes >= fromMinutes && nowMinutes <= toMinutes
  }

  // Ingredients
  async function fetchIngredients() {
    setLoadingIngs(true)
    const { data } = await supabase.from('ingredients').select('*').order('name', { ascending: true })
    if (data) setIngredients(data)
    setLoadingIngs(false)
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    const { data, error } = await supabase.from('ingredients').insert([{
      name: form.name, unit: form.unit, cost: parseFloat(form.cost.replace(',', '.'))
    }]).select()
    if (error) alert('Erro: ' + error.message)
    else if (data) { setIngredients([...ingredients, data[0]].sort((a, b) => a.name.localeCompare(b.name))); setForm({ name: '', unit: 'un', cost: '' }) }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apagar este ingrediente?')) return
    await supabase.from('ingredients').delete().eq('id', id)
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  async function handleSaveCost(id: string, cost: string) {
    setSavingIng(true)
    await supabase.from('ingredients').update({ cost: parseFloat(cost.replace(',', '.')) }).eq('id', id)
    setSavingIng(false)
  }

  const currentlyOpen = isCurrentlyOpen()

  return (
    <div className="space-y-6 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Configurações</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie as informações e preferências do seu restaurante.</p>
        </div>

        {/* Status do Restaurante */}
        <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${currentlyOpen ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${currentlyOpen ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          {currentlyOpen ? 'Restaurante Aberto' : 'Restaurante Fechado'}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-1 justify-center ${activeTab === tab.id ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ===== ABA RESTAURANTE ===== */}
      {activeTab === 'restaurante' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-5 h-5 text-red-600" /> Informações do Restaurante
          </h3>

          {/* Logo */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-3">Logotipo</label>
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                {uploadingLogo ? <Loader2 className="w-7 h-7 animate-spin text-slate-400" /> :
                  settings.logo_url ? <img src={settings.logo_url} className="w-full h-full object-contain p-2" alt="Logo" /> :
                  <ImageIcon className="w-8 h-8 text-slate-300" />}
              </div>
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-red-400 rounded-xl p-5 cursor-pointer transition-colors bg-slate-50 hover:bg-slate-100">
                  <UploadCloud className="w-6 h-6 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">Clique para enviar o logotipo</span>
                  <span className="text-xs text-slate-400">PNG, JPG ou SVG recomendado</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Restaurante</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
                value={settings.restaurant_name}
                onChange={e => setSettings(s => ({ ...s, restaurant_name: e.target.value }))}
                placeholder="Ex: Krikas Burguer"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">WhatsApp</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
                value={settings.whatsapp}
                onChange={e => setSettings(s => ({ ...s, whatsapp: e.target.value }))}
                placeholder="Ex: 5511999990000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1">Endereço Completo</label>
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600"
                value={settings.address}
                onChange={e => setSettings(s => ({ ...s, address: e.target.value }))}
                placeholder="Ex: Rua das Flores, 123 – Centro – São Paulo/SP"
              />
            </div>
          </div>
        </div>
      )}

      {/* ===== ABA DELIVERY ===== */}
      {activeTab === 'delivery' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-600" /> Configurações de Delivery
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-3">Tipo de Taxa de Entrega</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'free', label: 'Grátis', desc: 'Sem taxa de entrega' },
                { value: 'fixed', label: 'Taxa Fixa', desc: 'Valor único para todos' },
                { value: 'variable', label: 'A Combinar', desc: 'Definido no pedido' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, delivery_fee_type: opt.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.delivery_fee_type === opt.value ? 'border-red-600 bg-red-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                >
                  <p className={`text-sm font-bold ${settings.delivery_fee_type === opt.value ? 'text-red-700' : 'text-slate-700'}`}>{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settings.delivery_fee_type === 'fixed' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Valor da Entrega (R$)</label>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-red-600">
                  <span className="px-3 text-slate-500 font-bold text-sm">R$</span>
                  <input
                    type="text"
                    className="flex-1 p-3 text-sm text-slate-900 bg-transparent outline-none"
                    value={settings.delivery_fee}
                    onChange={e => setSettings(s => ({ ...s, delivery_fee: e.target.value }))}
                    placeholder="5.00"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Pedido Mínimo (R$)</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-red-600">
                <span className="px-3 text-slate-500 font-bold text-sm">R$</span>
                <input
                  type="text"
                  className="flex-1 p-3 text-sm text-slate-900 bg-transparent outline-none"
                  value={settings.min_order}
                  onChange={e => setSettings(s => ({ ...s, min_order: e.target.value }))}
                  placeholder="20.00"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ABA HORÁRIOS ===== */}
      {activeTab === 'horarios' && (
        <div className="space-y-4">
          {/* Controle Manual */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Controle de Abertura</h3>
            <p className="text-sm text-slate-500 mb-5">Modo automático: abre/fecha conforme os horários abaixo. Ou force o status manualmente.</p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'auto', label: '🤖 Automático', desc: 'Segue os horários', color: 'blue' },
                { value: 'open', label: '✅ Forçar Aberto', desc: 'Aberto agora', color: 'emerald' },
                { value: 'closed', label: '🔴 Forçar Fechado', desc: 'Fechado agora', color: 'red' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSettings(s => ({ ...s, is_open_override: opt.value }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.is_open_override === opt.value
                    ? opt.color === 'blue' ? 'border-blue-500 bg-blue-50'
                      : opt.color === 'emerald' ? 'border-emerald-500 bg-emerald-50'
                      : 'border-red-500 bg-red-50'
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                >
                  <p className="text-sm font-bold text-slate-800">{opt.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Horários por dia */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" /> Horários de Funcionamento
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              {DAYS.map(day => {
                const h = settings.business_hours[day.key] || { open: false, from: '18:00', to: '23:00' }
                return (
                  <div key={day.key} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="sm:w-36">
                      <p className="font-bold text-slate-800 text-sm">{day.label}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => updateHours(day.key, 'open', !h.open)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${h.open ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}
                    >
                      {h.open ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      {h.open ? 'Aberto' : 'Fechado'}
                    </button>

                    {h.open && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">Das</span>
                          <input
                            type="time"
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-red-600"
                            value={h.from}
                            onChange={e => updateHours(day.key, 'from', e.target.value)}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-bold">às</span>
                          <input
                            type="time"
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 outline-none focus:border-red-600"
                            value={h.to}
                            onChange={e => updateHours(day.key, 'to', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ===== ABA INGREDIENTES ===== */}
      {activeTab === 'ingredientes' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" /> Adicionar Ingrediente
            </h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 mb-1">Nome</label>
                <input type="text" required placeholder="Ex: Hamburguer 150g" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Unidade</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Custo (R$)</label>
                <div className="flex gap-2">
                  <input type="text" required placeholder="Ex: 2.50" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} />
                  <button disabled={adding} className="bg-red-600 text-white px-4 rounded-xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors flex-shrink-0">
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Ingredientes Cadastrados ({ingredients.length})</h3>
              {savingIng && <span className="text-xs text-slate-400 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" />Salvando...</span>}
            </div>
            {loadingIngs ? (
              <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-red-600" /></div>
            ) : ingredients.length === 0 ? (
              <div className="p-10 text-center text-slate-400 text-sm">Nenhum ingrediente cadastrado ainda.</div>
            ) : (
              <div className="divide-y divide-slate-50">
                <div className="grid grid-cols-12 px-6 py-3 bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-5">Ingrediente</div>
                  <div className="col-span-2 text-center">Unidade</div>
                  <div className="col-span-3 text-center">Custo (R$)</div>
                  <div className="col-span-2 text-right">Ação</div>
                </div>
                {ingredients.map(ing => (
                  <div key={ing.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-slate-50/50">
                    <div className="col-span-5"><p className="font-semibold text-slate-800 text-sm">{ing.name}</p></div>
                    <div className="col-span-2 text-center"><span className="text-xs bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded-lg">{ing.unit}</span></div>
                    <div className="col-span-3 flex justify-center">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-xs font-bold">R$</span>
                        <input
                          type="text"
                          className="w-20 bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-sm text-center text-slate-900 outline-none focus:border-red-600 font-mono"
                          defaultValue={ing.cost}
                          onBlur={e => handleSaveCost(ing.id, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-end">
                      <button onClick={() => handleDelete(ing.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Botão Salvar (exceto aba ingredientes) */}
      {activeTab !== 'ingredientes' && (
        <div className="flex justify-end">
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : saved ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Save className="w-5 h-5" />}
            {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar Configurações'}
          </button>
        </div>
      )}
    </div>
  )
}

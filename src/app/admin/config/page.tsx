'use client'

import { useState, useEffect } from 'react'
import {
  Plus, Trash2, Loader2, Package, UploadCloud, Image as ImageIcon,
  MapPin, Clock, DollarSign, Store, Save, CheckCircle2, ChevronDown, ChevronUp, ToggleLeft, ToggleRight, FileSpreadsheet, Download, AlertTriangle, XCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'

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
  const [form, setForm] = useState({ name: '', unit: 'un', paidValue: '', packageVolume: '1', correctionFactor: '1.00' })
  const [adding, setAdding] = useState(false)
  const [savingIng, setSavingIng] = useState(false)

  // Excel Import for Ingredients
  const [showImport, setShowImport] = useState(false)
  const [importPreview, setImportPreview] = useState<any[]>([])
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [importing, setImporting] = useState(false)
  const [importDone, setImportDone] = useState(false)

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
    
    const pv = parseFloat(form.paidValue.replace(',', '.')) || 0
    const vol = parseFloat(form.packageVolume.replace(',', '.')) || 1
    const fc = parseFloat(form.correctionFactor.replace(',', '.')) || 1
    const calculatedCleanCost = (pv / vol) * fc

    const { data, error } = await supabase.from('ingredients').insert([{
      name: form.name, 
      unit: form.unit, 
      paid_value: pv,
      package_volume: vol,
      correction_factor: fc,
      cost: calculatedCleanCost
    }]).select()

    if (error) alert('Erro: ' + error.message)
    else if (data) { 
      setIngredients([...ingredients, data[0]].sort((a, b) => a.name.localeCompare(b.name))); 
      setForm({ name: '', unit: 'un', paidValue: '', packageVolume: '1', correctionFactor: '1.00' }) 
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Apagar este ingrediente?')) return
    await supabase.from('ingredients').delete().eq('id', id)
    setIngredients(ingredients.filter(i => i.id !== id))
  }

  async function handleSaveCost(id: string, paidValueStr: string, vol: number, fc: number) {
    setSavingIng(true)
    const pv = parseFloat(paidValueStr.replace(',', '.')) || 0
    const calculatedCost = (pv / vol) * fc
    await supabase.from('ingredients').update({ 
      paid_value: pv,
      cost: calculatedCost
    }).eq('id', id)
    fetchIngredients()
    setSavingIng(false)
  }

  async function handleUpdateRow(id: string, field: string, value: string) {
    const ing = ingredients.find(i => i.id === id);
    if (!ing) return;
    
    let updates: any = {};
    let pv = ing.paid_value || 0;
    let vol = ing.package_volume || 1;
    let fc = ing.correction_factor || 1;

    if (field === 'paid_value') {
      updates.paid_value = parseFloat(value.replace(',', '.')) || 0;
      pv = updates.paid_value;
    } else if (field === 'package_volume') {
      updates.package_volume = parseFloat(value.replace(',', '.')) || 1;
      vol = updates.package_volume;
    } else if (field === 'correction_factor') {
      updates.correction_factor = parseFloat(value.replace(',', '.')) || 1;
      fc = updates.correction_factor;
    } else if (field === 'name') {
      updates.name = value;
    } else if (field === 'unit') {
      updates.unit = value;
    }

    if (['paid_value', 'package_volume', 'correction_factor'].includes(field)) {
      updates.cost = (pv / vol) * fc;
    }

    setSavingIng(true);
    await supabase.from('ingredients').update(updates).eq('id', id);
    fetchIngredients();
    setSavingIng(false);
  }

  // ==== IMPORTAÇÃO DE EXCEL (INGREDIENTES) ====
  function downloadTemplate() {
    const ws = XLSX.utils.aoa_to_sheet([
      ['nome', 'unidade', 'valor_pago', 'volume_embalagem', 'fc'],
      ['Hamburguer 150g', 'un', '25.00', '10', '1.00'],
      ['Cebola Roxa', 'kg', '5.00', '1', '1.11'],
      ['Queijo Cheddar', 'kg', '45.00', '1', '1.00'],
    ])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Ingredientes')
    XLSX.writeFile(wb, 'modelo_ingredientes_krikas_v2.xlsx')
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
        const name = String(row['nome'] || row['Nome'] || row['NOME'] || row['PRODUTOS'] || '').trim()
        const unidade = String(row['unidade'] || row['Unidade'] || row['UNIDADE DE MEDIDA'] || 'un').trim()
        const paid_value = parseFloat(String(row['valor_pago'] || row['Valor Pago'] || row['VALOR PAGO'] || row['VALOR PAGO (R$)'] || '0').replace(',', '.'))
        const package_volume = parseFloat(String(row['volume_embalagem'] || row['Volume'] || row['VOLUME EMBALAGEM'] || '1').replace(',', '.'))
        const fc = parseFloat(String(row['fc'] || row['F.C.'] || row['F.C'] || '1').replace(',', '.'))

        const calculatedCost = (paid_value / package_volume) * fc

        if (!name) errors.push(`Linha ${i + 2}: Nome em branco`)
        if (isNaN(paid_value)) errors.push(`Linha ${i + 2}: Valor pago inválido`)

        return { name, unidade, paid_value, package_volume, fc, cost: calculatedCost, valid: !!name && !isNaN(paid_value) }
      }).filter(r => r.name)

      setImportErrors(errors)
      setImportPreview(preview)
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  async function handleImport() {
    if (importPreview.length === 0) return
    setImporting(true)

    const validRows = importPreview.filter(r => r.valid)
    const toInsert = validRows.map(row => ({
      name: row.name,
      unit: row.unidade,
      paid_value: row.paid_value || 0,
      package_volume: row.package_volume || 1,
      correction_factor: row.fc || 1,
      cost: row.cost || 0,
    }))

    const { error } = await supabase.from('ingredients').insert(toInsert)

    if (error) {
      alert('Erro ao importar: ' + error.message)
    } else {
      setImportDone(true)
      setImportPreview([])
      fetchIngredients()
    }
    setImporting(false)
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

          <div className="flex flex-col sm:flex-row sm:justify-end">
            <button
              onClick={() => { setShowImport(!showImport); setImportDone(false) }}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 transition-colors"
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
                  Importar Ingredientes do Excel
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Faça o download do modelo, preencha sua planilha e importe vários ingredientes de uma vez.
                </p>
              </div>

              <div className="p-6 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">1</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 mb-2">Baixe o modelo da planilha</p>
                    <button onClick={downloadTemplate} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <Download className="w-4 h-4" />
                      Baixar modelo_ingredientes_krikas_v2.xlsx
                    </button>
                    <p className="text-xs text-slate-500 mt-2">Colunas: <strong>nome | unidade | valor_pago | volume_embalagem | fc</strong></p>
                  </div>
                </div>

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

                {importErrors.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
                    <p className="text-sm font-bold text-amber-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Avisos encontrados ({importErrors.length})
                    </p>
                    {importErrors.map((err, i) => <p key={i} className="text-xs text-amber-700">• {err}</p>)}
                  </div>
                )}

                {importPreview.length > 0 && (
                  <div className="space-y-3">
                    <p className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      {importPreview.filter(r => r.valid).length} ingrediente(s) prontos para importar:
                    </p>
                    <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-100">
                      <table className="w-full text-xs">
                        <thead className="bg-slate-50 sticky top-0">
                          <tr>
                            <th className="p-3 text-left font-bold text-slate-500">Nome</th>
                            <th className="p-3 text-left font-bold text-slate-500">Pago / Vol.</th>
                            <th className="p-3 text-center font-bold text-slate-500">F.C.</th>
                            <th className="p-3 text-right font-bold text-slate-500">Custo (Limpo)</th>
                            <th className="p-3 text-center font-bold text-slate-500">OK?</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {importPreview.map((row, i) => (
                            <tr key={i} className={row.valid ? 'bg-white' : 'bg-red-50'}>
                              <td className="p-3 font-medium text-slate-800">{row.name || '—'}</td>
                              <td className="p-3 text-slate-600">R$ {row.paid_value?.toFixed(2)} / {row.package_volume} {row.unidade}</td>
                              <td className="p-3 text-center text-slate-600">{row.fc?.toFixed(2)}</td>
                              <td className="p-3 text-right font-bold text-emerald-600">R$ {row.cost?.toFixed(2)}</td>
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
                      {importing ? 'Importando...' : `Confirmar e Importar ${importPreview.filter(r => r.valid).length} Ingredientes`}
                    </button>
                  </div>
                )}

                {importDone && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-800">Importação concluída com sucesso!</p>
                      <p className="text-sm text-emerald-700">Todos os ingredientes foram adicionados à sua ficha técnica.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-red-600" /> Adicionar Ingrediente Manualmente
            </h3>
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Nome</label>
                <input type="text" required placeholder="Ex: Cebola Roxa" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Valor Pago (R$)</label>
                <input type="text" required placeholder="Ex: 5.00" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.paidValue} onChange={e => setForm({ ...form, paidValue: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider truncate" title="Volume da Embalagem">Vol. Emb.</label>
                  <input type="text" required placeholder="Ex: 1" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.packageVolume} onChange={e => setForm({ ...form, packageVolume: e.target.value })} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Un.</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">F.C.</label>
                <input type="text" required placeholder="Ex: 1.11" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" value={form.correctionFactor} onChange={e => setForm({ ...form, correctionFactor: e.target.value })} />
              </div>
              <div className="flex items-end">
                <button disabled={adding} className="w-full bg-red-600 text-white h-[46px] rounded-xl flex items-center justify-center font-bold text-sm shadow-lg hover:bg-red-700 transition-colors">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-xl border border-slate-200 overflow-hidden mt-6">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <h3 className="font-black text-slate-800 text-lg uppercase tracking-wide">Lista de Insumos</h3>
              {savingIng && <span className="text-xs text-blue-600 font-bold flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full"><Loader2 className="w-3 h-3 animate-spin" /> Atualizando planilha...</span>}
            </div>
            
            {loadingIngs ? (
              <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
            ) : ingredients.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">A planilha está vazia. Cadastre ou importe ingredientes.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 w-12 text-center text-[10px] font-bold">CÓD.</th>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 text-left text-[10px] font-bold min-w-[200px]">PRODUTOS</th>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 w-28 text-center text-[10px] font-bold whitespace-nowrap">VALOR<br/>PAGO (R$)</th>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 w-28 text-center text-[10px] font-bold whitespace-nowrap">VOLUME<br/>EMBALAGEM</th>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 w-28 text-center text-[10px] font-bold whitespace-nowrap">UNIDADE DE<br/>MEDIDA</th>
                      <th className="border border-slate-300 bg-[#4f81bd] text-white p-2 w-20 text-center text-[10px] font-bold">F.C.</th>
                      <th className="border border-slate-300 bg-[#8db4e2] text-white p-2 w-32 text-center text-[10px] font-bold whitespace-nowrap">VALOR<br/>KG/Litro/ UND</th>
                      <th className="border border-slate-300 bg-[#1f497d] text-white p-2 w-32 text-center text-[10px] font-bold whitespace-nowrap">VALOR LIMPO<br/>KG/ Litro/ UND</th>
                      <th className="border border-slate-300 bg-white p-2 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ing, index) => {
                      const pv = ing.paid_value || 0;
                      const vol = ing.package_volume || 1;
                      const fc = ing.correction_factor || 1;
                      const valorUnd = pv / vol;
                      const valorLimpo = valorUnd * fc;
                      
                      return (
                        <tr key={ing.id} className="hover:bg-slate-50 transition-colors">
                          <td className="border border-slate-300 p-1 text-center font-bold text-slate-500 text-xs bg-slate-50">
                            {index + 1}
                          </td>
                          <td className="border border-slate-300 p-0">
                            <input 
                              type="text" 
                              className="w-full h-full px-2 py-2 text-xs font-medium text-slate-800 outline-none focus:bg-yellow-50 transition-colors"
                              defaultValue={ing.name}
                              onBlur={e => handleUpdateRow(ing.id, 'name', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 p-0">
                            <div className="flex h-full w-full items-center px-2 focus-within:bg-yellow-50">
                              <span className="text-slate-400 text-[10px]">R$</span>
                              <input 
                                type="text" 
                                className="w-full h-full bg-transparent text-right text-xs text-slate-700 outline-none"
                                defaultValue={pv.toFixed(2)}
                                onBlur={e => handleUpdateRow(ing.id, 'paid_value', e.target.value)}
                              />
                            </div>
                          </td>
                          <td className="border border-slate-300 p-0">
                            <input 
                              type="text" 
                              className="w-full h-full px-2 text-center text-xs text-slate-700 outline-none focus:bg-yellow-50"
                              defaultValue={vol}
                              onBlur={e => handleUpdateRow(ing.id, 'package_volume', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 p-0">
                            <select 
                              className="w-full h-full px-2 text-center text-xs text-slate-700 outline-none focus:bg-yellow-50 appearance-none bg-transparent cursor-pointer"
                              value={ing.unit}
                              onChange={e => handleUpdateRow(ing.id, 'unit', e.target.value)}
                            >
                              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                          </td>
                          <td className="border border-slate-300 p-0">
                            <input 
                              type="text" 
                              className="w-full h-full px-2 text-center text-xs text-slate-700 outline-none focus:bg-yellow-50"
                              defaultValue={fc.toFixed(2)}
                              onBlur={e => handleUpdateRow(ing.id, 'correction_factor', e.target.value)}
                            />
                          </td>
                          <td className="border border-slate-300 p-2 text-right bg-slate-50 font-medium">
                            <span className="text-[10px] text-slate-400 mr-1">R$</span>
                            <span className="text-slate-700 text-xs">{valorUnd.toFixed(2)}</span>
                          </td>
                          <td className="border border-slate-300 p-2 text-right font-bold bg-[#f2f2f2]">
                            <span className="text-[10px] text-slate-500 mr-1">R$</span>
                            <span className="text-slate-800 text-xs">{valorLimpo.toFixed(2)}</span>
                          </td>
                          <td className="border border-slate-300 p-1 text-center bg-white">
                            <button onClick={() => handleDelete(ing.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors mx-auto block" title="Excluir">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
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

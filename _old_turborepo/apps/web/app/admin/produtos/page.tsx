'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  Eye,
  Tag,
  Image as ImageIcon,
  X,
  PlusCircle,
  Settings2,
  CheckCircle2,
  ChevronRight
} from 'lucide-react'

const ALL_PRODUCTS = [
  { id: '1', name: 'Krikas Premium 160g', category: 'Hambúrguer', price: '29,90', status: 'Ativo', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=100&q=80', description: 'Hambúrguer artesanal 160g, Cheddar duplo, Bacon Crocante e Maionese no Pão Brioche Tostado.', addons: [] },
  { id: '2', name: 'Smash Duplo 140g', category: 'Smashs', price: '22,90', status: 'Ativo', img: 'https://images.unsplash.com/photo-1510709638350-ef2b1cbdcc91?w=100&q=80', description: 'Dois blends de 70g, queijo cheddar duplo e pão brioche.', addons: [] },
]

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('info') // 'info' or 'addons'
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Estados do Formulário
  const [addonGroups, setAddonGroups] = useState<any[]>([])

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product)
      setImagePreview(product.img)
      setAddonGroups(product.addons || [])
    } else {
      setEditingProduct(null)
      setImagePreview(null)
      setAddonGroups([])
    }
    setActiveTab('info')
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const addAddonGroup = () => {
    setAddonGroups([...addonGroups, { name: '', required: false, min: 0, max: 1, options: [{ name: '', price: '' }] }])
  }

  const removeAddonGroup = (index: number) => {
    setAddonGroups(addonGroups.filter((_, i) => i !== index))
  }

  const addOption = (groupIndex: number) => {
    const newGroups = [...addonGroups]
    newGroups[groupIndex].options.push({ name: '', price: '' })
    setAddonGroups(newGroups)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestão do Cardápio</h2>
          <p className="text-slate-500 text-sm mt-1">Gerencie seus produtos, preços e adicionais personalizados.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all self-start"
        >
          <Plus className="w-5 h-5" /> Novo Produto
        </button>
      </div>

      {/* Modal de Produto */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
                  </h3>
                  <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
                    <button 
                      onClick={() => setActiveTab('info')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'info' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Informações
                    </button>
                    <button 
                      onClick={() => setActiveTab('addons')}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === 'addons' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Adicionais
                    </button>
                  </div>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
                {activeTab === 'info' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome do Produto</label>
                        <input 
                          type="text" 
                          defaultValue={editingProduct?.name} 
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600" 
                          placeholder="Ex: Krikas Bacon" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Categoria</label>
                          <select 
                            defaultValue={editingProduct?.category} 
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600 appearance-none"
                          >
                            <option>Hambúrguer</option>
                            <option>Smashs</option>
                            <option>Combos</option>
                            <option>Bebidas</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Preço (R$)</label>
                          <input 
                            type="text" 
                            defaultValue={editingProduct?.price} 
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600" 
                            placeholder="29,90" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Descrição</label>
                        <textarea 
                          defaultValue={editingProduct?.description} 
                          className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-900 outline-none focus:border-red-600 h-32 resize-none" 
                          placeholder="Detalhes dos ingredientes..."
                        ></textarea>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Foto do Produto</label>
                      <div className="relative aspect-square">
                        <input type="file" id="product-image" className="hidden" accept="image/*" onChange={handleImageChange} />
                        <label 
                          htmlFor="product-image" 
                          className="flex flex-col items-center justify-center w-full h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-100 hover:border-red-300 transition-all overflow-hidden relative group"
                        >
                          {imagePreview ? (
                            <>
                              <img src={imagePreview} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Trocar imagem</span>
                              </div>
                            </>
                          ) : (
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                              <ImageIcon className="w-12 h-12" />
                              <div className="text-center">
                                <span className="text-xs font-bold block">Escolher Foto</span>
                                <span className="text-[10px]">PNG ou JPG</span>
                              </div>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Grupos de Adicionais</h4>
                        <p className="text-xs text-slate-400 mt-1">Crie grupos como "Ponto da Carne" ou "Adicionais Extras".</p>
                      </div>
                      <button 
                        onClick={addAddonGroup}
                        className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" /> Adicionar Grupo
                      </button>
                    </div>

                    {addonGroups.length === 0 ? (
                      <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <Settings2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-sm text-slate-400 font-medium">Nenhum adicional cadastrado para este produto.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {addonGroups.map((group, gIdx) => (
                          <div key={gIdx} className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
                            <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                              <input 
                                type="text" 
                                placeholder="Nome do Grupo (ex: Adicionais)" 
                                className="bg-transparent border-none outline-none text-sm font-bold text-slate-800 placeholder:text-slate-300 w-1/2"
                                value={group.name}
                                onChange={(e) => {
                                  const newGroups = [...addonGroups];
                                  newGroups[gIdx].name = e.target.value;
                                  setAddonGroups(newGroups);
                                }}
                              />
                              <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" />
                                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Obrigatório</span>
                                </label>
                                <button onClick={() => removeAddonGroup(gIdx)} className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="p-6 space-y-4">
                              {group.options.map((opt: any, oIdx: number) => (
                                <div key={oIdx} className="flex items-center gap-4">
                                  <div className="flex-1 space-y-1">
                                    <input 
                                      type="text" 
                                      placeholder="Nome do adicional (ex: Bacon)" 
                                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-red-600" 
                                      value={opt.name} 
                                    />
                                  </div>
                                  <div className="w-32 space-y-1">
                                    <input 
                                      type="text" 
                                      placeholder="Preço (ex: 5,00)" 
                                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 outline-none focus:border-red-600" 
                                      value={opt.price} 
                                    />
                                  </div>
                                  <button className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                onClick={() => addOption(gIdx)}
                                className="text-[10px] font-bold text-slate-400 hover:text-red-600 flex items-center gap-2 transition-colors mt-2"
                              >
                                <Plus className="w-3 h-3" /> ADICIONAR OPÇÃO
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all">Cancelar</button>
                <button className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Salvar Produto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabela de Produtos */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Pesquisar lanches..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-600/20" />
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-slate-50 border border-slate-100 rounded-xl py-2.5 px-4 text-xs outline-none font-bold text-slate-500">
              <option>Categorias</option>
              <option>Hambúrguer</option>
              <option>Bebidas</option>
            </select>
            <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
              <Settings2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase font-black tracking-widest border-b border-slate-50">
                <th className="px-6 py-5">Produto</th>
                <th className="px-6 py-5">Categoria</th>
                <th className="px-6 py-5">Preço</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ALL_PRODUCTS.map((product, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm">
                        <img src={product.img} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{product.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Ref: {product.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider">
                      <Tag className="w-3 h-3" /> {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">R$ {product.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      product.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleOpenModal(product)} className="p-2 hover:bg-amber-50 rounded-lg text-amber-600 transition-colors" title="Editar"><Edit3 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

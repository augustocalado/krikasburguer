'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  Plus, 
  Search, 
  Package, 
  Tag,
  DollarSign,
  ListChecks,
  FileSpreadsheet,
  Smartphone,
  Bell
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag, href: '/admin/pedidos' },
    { id: 'categorias', label: 'Categorias', icon: Tag, href: '/admin/categorias' },
    { id: 'produtos', label: 'Produtos', icon: Package, href: '/admin/produtos' },
    { id: 'clientes', label: 'Clientes', icon: Users, href: '/admin/clientes' },
    { id: 'config', label: 'Configurações', icon: Settings, href: '/admin/config' },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <Link href="/admin" className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-bold text-xl">K</div>
            <span className="font-bold text-lg tracking-tight">Krikas<span className="text-red-500">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-8 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="Admin" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white leading-none">Admin Krikas</span>
              <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Dono</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Pesquisar..." className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-red-600/20" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </header>

        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

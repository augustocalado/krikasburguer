import Link from 'next/link'
import { Camera, MessageCircle, MapPin, Clock, Home, ShoppingBag, User } from 'lucide-react'

export function Footer({ settings = {} }: { settings?: any }) {
  const logoUrl = settings.logo_url || '/logo.png'
  const restaurantName = settings.restaurant_name || 'KrikasBurguer'
  const address = settings.address || 'Alameda Yayá\nGuarulhos, SP'
  const whatsapp = settings.whatsapp || ''
  
  // Parse hours to show in footer
  let hoursDisplay = 'Ter - Dom: 18:00 às 23:30\nSegunda: Fechado'
  if (settings.business_hours) {
    try {
      const h = typeof settings.business_hours === 'string' ? JSON.parse(settings.business_hours) : settings.business_hours
      // Just a simplified logic for footer
      const isOpenToday = h['seg']?.open || h['ter']?.open
      if (isOpenToday) {
        hoursDisplay = 'Verifique nossos horários completos no menu'
      }
    } catch(e) {}
  }

  return (
    <>
      <footer className="bg-slate-900 pt-24 pb-12 text-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link href="/" className="flex items-center gap-3">
                <img src={logoUrl} alt={`${restaurantName} Logo`} className="w-16 h-16 object-contain rounded-full border-2 border-red-600/20 shadow-lg bg-slate-50 p-1" />
                <span className="font-black text-3xl tracking-tighter text-white">{restaurantName}</span>
              </Link>
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Criando experiências gastronômicas únicas através do verdadeiro hambúrguer artesanal. Sabor, qualidade e paixão em cada mordida.
              </p>
                <button className="w-12 h-12 bg-white/5 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all border border-white/10 group">
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="w-12 h-12 bg-white/5 hover:bg-emerald-600 rounded-xl flex items-center justify-center transition-all border border-white/10 group">
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Localização</h4>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {address}
                  </p>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <p className="text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                    {hoursDisplay}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Links Úteis</h4>
              <nav className="flex flex-col gap-3">
                <Link href="/menu" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Cardápio Digital</Link>
                <Link href="/pedidos" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Meus Pedidos</Link>
                <Link href="/admin" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Área do Lojista</Link>
                <Link href="/quem-somos" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Quem Somos</Link>
              </nav>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <p>© {new Date().getFullYear()} {restaurantName}. Todos os direitos reservados.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-white transition-colors">Termos de Uso</Link>
              <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 lg:hidden z-50 px-8 py-3 pb-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center gap-1 text-red-600">
            <Home className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Início</span>
          </Link>
          <Link href="/menu" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Cardápio</span>
          </Link>
          <Link href="/pedidos" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <Clock className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Pedidos</span>
          </Link>
          <Link href="/admin" className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-600 transition-colors">
            <User className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  )
}

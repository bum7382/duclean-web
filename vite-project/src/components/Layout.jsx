import { Link, Outlet } from 'react-router-dom'
import logoColor from '../assets/images/logo_color.png'

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoColor} alt="DuClean" className="h-9 w-auto" />
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-medium tracking-widest text-slate-400">
                DUCLEAN
              </span>
              <span className="text-base font-semibold text-brand">
                집진기 관리
              </span>
            </div>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

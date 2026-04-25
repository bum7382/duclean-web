import { Link, Outlet } from 'react-router-dom'
import logoColor from '../assets/images/logo_color.png'

export default function Layout() {
  return (
    <div className="min-h-full flex flex-col bg-white">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <img src={logoColor} alt="DuClean" className="h-8 w-auto" />
            <span className="text-lg font-semibold text-brand">
              DuClean 집진기 관리
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'

export default function DeviceCard({ device, activeCount }) {
  const hasAlarm = activeCount > 0
  return (
    <Link
      to={`/devices/${encodeURIComponent(device.mac_address)}`}
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${
        hasAlarm
          ? 'border-red-200 hover:border-red-300'
          : 'border-slate-200 hover:border-brand'
      }`}
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 ${
          hasAlarm ? 'bg-red-500' : 'bg-brand'
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] font-medium tracking-widest text-slate-400">
            SERIAL
          </div>
          <div className="mt-1 truncate text-lg font-bold text-slate-900">
            {device.serial || '미등록'}
          </div>
        </div>
        {hasAlarm ? (
          <div className="shrink-0 rounded-xl bg-red-50 px-3 py-1.5 text-center">
            <div className="text-[10px] font-semibold tracking-wider text-red-500">
              진행중
            </div>
            <div className="text-lg font-bold leading-none text-red-600">
              {activeCount}
            </div>
          </div>
        ) : (
          <div className="shrink-0 rounded-xl bg-emerald-50 px-3 py-2 text-center">
            <div className="text-xs font-bold tracking-wider text-emerald-600">
              정상
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-[10px] font-medium tracking-widest text-slate-400">
          MAC
        </span>
        <span className="font-mono text-xs text-slate-500">
          {device.mac_address}
        </span>
      </div>
    </Link>
  )
}

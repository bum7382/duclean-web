import { Link } from 'react-router-dom'

export default function DeviceCard({ device, activeCount }) {
  return (
    <Link
      to={`/devices/${encodeURIComponent(device.mac_address)}`}
      className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand hover:shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-slate-500">SERIAL</div>
          <div className="mt-0.5 font-semibold text-slate-900">
            {device.serial || '미등록'}
          </div>
        </div>
        {activeCount > 0 ? (
          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600">
            알람 {activeCount}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
            정상
          </span>
        )}
      </div>
      <div className="mt-4 font-mono text-xs text-slate-500">
        {device.mac_address}
      </div>
    </Link>
  )
}

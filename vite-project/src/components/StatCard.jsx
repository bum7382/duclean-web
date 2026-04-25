const PALETTE = {
  brand: 'bg-brand-light text-brand',
  danger: 'bg-red-50 text-red-600',
  ok: 'bg-emerald-50 text-emerald-600',
}

export default function StatCard({ label, value, tone = 'brand' }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2">
        <span
          className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-0.5 text-lg font-bold ${PALETTE[tone]}`}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

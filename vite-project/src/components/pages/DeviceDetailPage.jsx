import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchLogs } from '../../lib/api'
import { STATUS_ENTRIES, statusLabel } from '../../lib/status'
import DateRangePicker from '../DateRangePicker'

const ACTIVE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'cleared', label: '해제됨' },
]

function formatDateTime(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', { hour12: true })
}

export default function DeviceDetailPage() {
  const { mac } = useParams()
  const [page, setPage] = useState(1)
  const [logs, setLogs] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchLogs({ mac, page, limit: 100 })
      .then((res) => {
        if (cancelled) return
        setLogs(res.data)
        setPagination(res.pagination)
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoading(false))
    return () => {
      cancelled = true
    }
  }, [mac, page])

  const filtered = useMemo(() => {
    const startBound = startDate ? new Date(`${startDate}T00:00:00`) : null
    const endBound = endDate ? new Date(`${endDate}T00:00:00`) : null
    if (endBound) endBound.setDate(endBound.getDate() + 1)

    return logs.filter((log) => {
      if (statusFilter !== 'all' && log.status !== Number(statusFilter)) return false
      if (activeFilter === 'active' && !log.active) return false
      if (activeFilter === 'cleared' && log.active) return false
      const ts = new Date(log.timestamp)
      if (startBound && ts < startBound) return false
      if (endBound && ts >= endBound) return false
      return true
    })
  }, [logs, statusFilter, activeFilter, startDate, endDate])

  const stats = useMemo(() => {
    const total = filtered.length
    const active = filtered.filter((l) => l.active).length
    return { total, active, cleared: total - active }
  }, [filtered])

  const serial = logs[0]?.serial

  const resetFilters = () => {
    setStartDate('')
    setEndDate('')
    setStatusFilter('all')
    setActiveFilter('all')
  }

  return (
    <section>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
      >
        ← 기기 목록으로
      </Link>

      <div className="mt-4 flex flex-wrap items-baseline gap-3">
        <h1 className="text-3xl font-bold text-slate-900">
          {serial || '기기 상세'}
        </h1>
        <span className="font-mono text-sm text-slate-500">{mac}</span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard label="조회된 알람" value={stats.total} tone="brand" />
        <StatCard label="진행중" value={stats.active} tone="danger" />
        <StatCard label="해제됨" value={stats.cleared} tone="ok" />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">필터</h2>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            초기화
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <FilterField label="기간">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onChange={({ startDate: s, endDate: e }) => {
                  setStartDate(s)
                  setEndDate(e)
                }}
              />
            </FilterField>
          </div>
          <FilterField label="상태">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="all">전체</option>
              {STATUS_ENTRIES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </FilterField>
          <FilterField label="알람 여부">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              {ACTIVE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </FilterField>
        </div>
      </div>

      {loading && (
        <div className="mt-6 text-sm text-slate-400">불러오는 중…</div>
      )}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          오류: {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">발생일</th>
                    <th className="px-4 py-3 text-left font-semibold">해제일</th>
                    <th className="px-4 py-3 text-left font-semibold">상태</th>
                    <th className="px-4 py-3 text-left font-semibold">알람</th>
                    <th className="px-4 py-3 text-left font-semibold">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((log, i) => (
                    <tr
                      key={`${log.timestamp}-${i}`}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                        {formatDateTime(log.stop_timestamp)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                        {statusLabel(log.status)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {log.active ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                            진행중
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            해제됨
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                        {log.ip_address}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-sm text-slate-400"
                      >
                        조건에 맞는 알람이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="text-slate-500">
                {pagination.page} / {pagination.totalPages} 페이지 (총{' '}
                {pagination.total}건)
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-brand disabled:opacity-40 disabled:hover:border-slate-300"
                >
                  이전
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 hover:border-brand disabled:opacity-40 disabled:hover:border-slate-300"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function StatCard({ label, value, tone }) {
  const palette = {
    brand: 'bg-brand-light text-brand',
    danger: 'bg-red-50 text-red-600',
    ok: 'bg-emerald-50 text-emerald-600',
  }[tone]
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs font-medium text-slate-500">{label}</div>
      <div className="mt-2">
        <span
          className={`inline-flex min-w-10 justify-center rounded-lg px-2 py-0.5 text-lg font-bold ${palette}`}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

function FilterField({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      {children}
    </label>
  )
}

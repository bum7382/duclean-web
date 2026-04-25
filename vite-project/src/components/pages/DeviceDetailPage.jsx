import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchLogs } from '../../lib/api'
import { STATUS_ENTRIES, statusLabel } from '../../lib/status'

const ACTIVE_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행중' },
  { value: 'cleared', label: '해제됨' },
]

function formatDateTime(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('ko-KR', { hour12: false })
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
    return logs.filter((log) => {
      if (statusFilter !== 'all' && log.status !== Number(statusFilter)) return false
      if (activeFilter === 'active' && !log.active) return false
      if (activeFilter === 'cleared' && log.active) return false
      const ts = new Date(log.timestamp)
      if (startDate && ts < new Date(startDate)) return false
      if (endDate) {
        const end = new Date(endDate)
        end.setDate(end.getDate() + 1)
        if (ts >= end) return false
      }
      return true
    })
  }, [logs, statusFilter, activeFilter, startDate, endDate])

  const serial = logs[0]?.serial

  return (
    <section>
      <Link to="/" className="text-sm text-brand hover:underline">
        ← 기기 목록으로
      </Link>
      <div className="mt-3 flex items-baseline gap-3">
        <h1 className="text-2xl font-bold text-slate-900">
          {serial || '기기 상세'}
        </h1>
        <span className="font-mono text-sm text-slate-500">{mac}</span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          시작일
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          종료일
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          상태
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            <option value="all">전체</option>
            {STATUS_ENTRIES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-slate-600">
          알람 여부
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {ACTIVE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && (
        <div className="mt-6 text-sm text-slate-400">불러오는 중…</div>
      )}
      {error && (
        <div className="mt-6 text-sm text-red-600">오류: {error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">발생일</th>
                  <th className="px-4 py-2 text-left font-medium">해제일</th>
                  <th className="px-4 py-2 text-left font-medium">상태</th>
                  <th className="px-4 py-2 text-left font-medium">알람</th>
                  <th className="px-4 py-2 text-left font-medium">IP</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => (
                  <tr
                    key={`${log.timestamp}-${i}`}
                    className="border-t border-slate-100"
                  >
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {formatDateTime(log.timestamp)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-500">
                      {formatDateTime(log.stop_timestamp)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-slate-700">
                      {statusLabel(log.status)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2">
                      {log.active ? (
                        <span className="inline-flex rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                          진행중
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                          해제됨
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-slate-500">
                      {log.ip_address}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-400"
                    >
                      조건에 맞는 알람이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
                  className="rounded border border-slate-300 px-3 py-1 text-slate-700 disabled:opacity-40"
                >
                  이전
                </button>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded border border-slate-300 px-3 py-1 text-slate-700 disabled:opacity-40"
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

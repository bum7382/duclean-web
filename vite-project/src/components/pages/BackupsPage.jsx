import { useEffect, useState } from 'react'
import { backupDownloadUrl, fetchBackups } from '../../lib/api'

function formatBytes(n) {
  if (n == null) return '-'
  const num = Number(n)
  if (Number.isNaN(num)) return '-'
  if (num < 1024) return `${num} B`
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`
  return `${(num / (1024 * 1024)).toFixed(2)} MB`
}

function dateFromName(name) {
  const m = name.match(/duclean_logs_(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : null
}

export default function BackupsPage() {
  const [backups, setBackups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    fetchBackups()
      .then((res) => {
        if (!cancel) {
          setBackups(res.data || [])
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancel) setError(e.message)
      })
      .finally(() => {
        if (!cancel) setLoading(false)
      })
    return () => {
      cancel = true
    }
  }, [])

  return (
    <section>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900">백업</h1>
        <span className="text-sm text-slate-500">
          Google Drive에 매일 KST 00:30 업로드된 일별 CSV
        </span>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          오류: {error}
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">날짜</th>
                <th className="px-4 py-3 text-left font-semibold">파일명</th>
                <th className="px-4 py-3 text-right font-semibold">크기</th>
                <th className="px-4 py-3 text-right font-semibold">다운로드</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                    {dateFromName(b.name) || '-'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                    {b.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-slate-500">
                    {formatBytes(b.size)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <a
                      href={backupDownloadUrl(b.id)}
                      className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand/20"
                    >
                      CSV
                    </a>
                  </td>
                </tr>
              ))}
              {!loading && backups.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    아직 백업 파일이 없습니다.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-12 text-center text-sm text-slate-400"
                  >
                    불러오는 중…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

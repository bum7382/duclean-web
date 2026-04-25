import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchDevices, fetchLogs } from '../../lib/api'
import DeviceCard from '../DeviceCard'
import StatCard from '../StatCard'
import RefreshBar from '../RefreshBar'

const POLL_INTERVAL_MS = 30_000

export default function DevicesPage() {
  const [devices, setDevices] = useState([])
  const [activeCounts, setActiveCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [devicesRes, logsRes] = await Promise.all([
        fetchDevices(),
        fetchLogs({ limit: 500 }),
      ])
      const counts = {}
      for (const log of logsRes.data) {
        if (log.active) {
          counts[log.mac_address] = (counts[log.mac_address] ?? 0) + 1
        }
      }
      setDevices(devicesRes.data)
      setActiveCounts(counts)
      setError(null)
      setLastUpdated(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [load])

  const stats = useMemo(() => {
    const total = devices.length
    const alerting = devices.filter(
      (d) => (activeCounts[d.mac_address] ?? 0) > 0,
    ).length
    return { total, alerting, normal: total - alerting }
  }, [devices, activeCounts])

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">등록된 기기</h1>
          <p className="mt-2 text-sm text-slate-500">
            기기를 선택하면 해당 기기의 알람 이력을 확인할 수 있습니다.
          </p>
        </div>
        <RefreshBar lastUpdated={lastUpdated} onRefresh={load} loading={loading} />
      </div>

      {!error && devices.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="전체 기기" value={stats.total} tone="brand" />
          <StatCard label="알람 진행 중인 기기" value={stats.alerting} tone="danger" />
          <StatCard label="정상 기기" value={stats.normal} tone="ok" />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          오류: {error}
        </div>
      )}

      {loading && devices.length === 0 && !error && (
        <div className="mt-10 text-sm text-slate-400">불러오는 중…</div>
      )}

      {!error && !loading && devices.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-slate-400">
          등록된 기기가 없습니다.
        </div>
      )}

      {devices.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {devices.map((d) => (
            <DeviceCard
              key={d.mac_address}
              device={d}
              activeCount={activeCounts[d.mac_address] ?? 0}
            />
          ))}
        </div>
      )}
    </section>
  )
}

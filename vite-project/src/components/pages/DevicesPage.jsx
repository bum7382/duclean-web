import { useEffect, useState } from 'react'
import { fetchDevices, fetchLogs } from '../../lib/api'
import DeviceCard from '../DeviceCard'

export default function DevicesPage() {
  const [devices, setDevices] = useState([])
  const [activeCounts, setActiveCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [devicesRes, logsRes] = await Promise.all([
          fetchDevices(),
          fetchLogs({ limit: 500 }),
        ])
        if (cancelled) return
        const counts = {}
        for (const log of logsRes.data) {
          if (log.active) {
            counts[log.mac_address] = (counts[log.mac_address] ?? 0) + 1
          }
        }
        setDevices(devicesRes.data)
        setActiveCounts(counts)
      } catch (e) {
        if (!cancelled) setError(e.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section>
      <h1 className="text-2xl font-bold text-slate-900">등록된 기기</h1>
      <p className="mt-2 text-slate-500">
        기기를 선택하면 해당 기기의 알람 이력을 확인할 수 있습니다.
      </p>

      {loading && (
        <div className="mt-8 text-sm text-slate-400">불러오는 중…</div>
      )}
      {error && (
        <div className="mt-8 text-sm text-red-600">오류: {error}</div>
      )}

      {!loading && !error && (
        devices.length === 0 ? (
          <div className="mt-8 text-sm text-slate-400">
            등록된 기기가 없습니다.
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {devices.map((d) => (
              <DeviceCard
                key={d.mac_address}
                device={d}
                activeCount={activeCounts[d.mac_address] ?? 0}
              />
            ))}
          </div>
        )
      )}
    </section>
  )
}

async function request(path) {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export function fetchDevices() {
  return request('/api/devices')
}

export function fetchLogs({ mac, page = 1, limit = 100 } = {}) {
  const params = new URLSearchParams()
  if (mac) params.set('mac', mac)
  params.set('page', String(page))
  params.set('limit', String(limit))
  return request(`/api/logs?${params}`)
}

export function fetchMetrics({ mac, from, to, limit = 1000 } = {}) {
  const params = new URLSearchParams()
  params.set('mac', mac)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  params.set('limit', String(limit))
  return request(`/api/metrics?${params}`)
}

export function metricsExportUrl({ mac, from, to } = {}) {
  const params = new URLSearchParams()
  params.set('mac', mac)
  if (from) params.set('from', from)
  if (to) params.set('to', to)
  return `/api/metrics/export?${params}`
}

export function fetchBackups() {
  return request('/api/backups')
}

export function backupDownloadUrl(id) {
  return `/api/backups/${encodeURIComponent(id)}/download`
}

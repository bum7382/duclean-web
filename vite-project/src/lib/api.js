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

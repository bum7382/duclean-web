export const STATUS_LABELS = {
  1: '과전류',
  2: '운전에러',
  3: '모터 역방향',
  4: '전류 불평형',
  5: '과차압',
  6: '필터교체',
  7: '저차압',
}

export const STATUS_ENTRIES = Object.entries(STATUS_LABELS).map(([k, v]) => ({
  value: Number(k),
  label: v,
}))

export function statusLabel(code) {
  return STATUS_LABELS[code] ?? `알 수 없음(${code})`
}

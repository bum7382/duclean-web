import { useEffect, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { ko } from 'react-day-picker/locale'
import 'react-day-picker/style.css'

function parseLocalDate(str) {
  if (!str) return undefined
  return new Date(`${str}T00:00:00`)
}

function toYMD(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatDisplay(str) {
  if (!str) return ''
  const d = parseLocalDate(str)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selected = {
    from: parseLocalDate(startDate),
    to: parseLocalDate(endDate),
  }

  const handleSelect = (range) => {
    onChange({
      startDate: range?.from ? toYMD(range.from) : '',
      endDate: range?.to ? toYMD(range.to) : '',
    })
  }

  const label =
    startDate && endDate
      ? `${formatDisplay(startDate)} ~ ${formatDisplay(endDate)}`
      : startDate
        ? `${formatDisplay(startDate)} ~`
        : endDate
          ? `~ ${formatDisplay(endDate)}`
          : '전체 기간'

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3 py-2 text-left text-sm text-slate-700 hover:border-brand focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
      >
        <span className={startDate || endDate ? 'text-slate-900' : 'text-slate-400'}>
          {label}
        </span>
        <svg
          className="h-4 w-4 text-slate-400"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18h-10.5A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zM3.5 8.5v6.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V8.5h-13z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
          <DayPicker
            mode="range"
            locale={ko}
            selected={selected}
            onSelect={handleSelect}
            numberOfMonths={1}
            showOutsideDays
          />
          <div className="mt-2 flex justify-end gap-2 border-t border-slate-100 pt-2">
            <button
              type="button"
              onClick={() => onChange({ startDate: '', endDate: '' })}
              className="rounded-md px-3 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              전체 기간
            </button>
            <button
              type="button"
              onClick={() => {
                const today = toYMD(new Date())
                onChange({ startDate: today, endDate: today })
              }}
              className="rounded-md px-3 py-1 text-xs text-slate-500 hover:bg-slate-100"
            >
              오늘
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-brand px-3 py-1 text-xs font-medium text-white hover:bg-brand-dark"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

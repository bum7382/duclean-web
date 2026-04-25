function formatTime(date) {
  if (!date) return '-'
  return date.toLocaleTimeString('ko-KR', { hour12: true })
}

export default function RefreshBar({ lastUpdated, onRefresh, loading }) {
  return (
    <div className="flex items-center gap-3 text-xs text-slate-500">
      <span>마지막 업데이트: {formatTime(lastUpdated)}</span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 font-medium text-slate-600 hover:border-brand hover:text-brand disabled:opacity-50"
      >
        <svg
          className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z"
            clipRule="evenodd"
          />
        </svg>
        새로고침
      </button>
    </div>
  )
}

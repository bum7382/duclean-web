import { Link, useParams } from 'react-router-dom'

export default function DeviceDetailPage() {
  const { mac } = useParams()
  return (
    <section>
      <Link to="/" className="text-sm text-brand hover:underline">
        ← 기기 목록으로
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">
        기기 상세
      </h1>
      <p className="mt-1 text-slate-500 font-mono text-sm">{mac}</p>
      <div className="mt-8 text-slate-400 text-sm">
        (알람 테이블 + 필터는 다음 단계에서 구현 예정)
      </div>
    </section>
  )
}

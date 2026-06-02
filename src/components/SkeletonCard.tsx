export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-5 w-16 bg-zinc-800 rounded-full" />
        <div className="h-4 w-8 bg-zinc-800 rounded" />
      </div>
      <div className="h-5 w-3/4 bg-zinc-800 rounded mb-3" />
      <div className="h-4 w-full bg-zinc-800 rounded mb-1.5" />
      <div className="h-4 w-2/3 bg-zinc-800 rounded" />
    </div>
  )
}

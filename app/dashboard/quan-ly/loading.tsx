import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 ${className ?? ''}`} />
}

export default function QuanLyLoading() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex-1 flex overflow-hidden">
          {/* Left nav skeleton */}
          <aside className="w-52 min-w-[208px] bg-white border-r border-gray-200 p-3 space-y-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-lg" />
            ))}
          </aside>
          {/* Content skeleton */}
          <div className="flex-1 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-24" />
                    <div className="ml-auto flex gap-2">
                      <Skeleton className="h-7 w-16 rounded" />
                      <Skeleton className="h-7 w-16 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

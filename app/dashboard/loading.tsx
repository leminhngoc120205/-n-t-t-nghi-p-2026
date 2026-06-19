import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className ?? ''}`} />
  )
}

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex-1 p-4 space-y-4">
          {/* Stat cards skeleton */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
          {/* Main content skeleton */}
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
            <Skeleton className="h-5 w-40" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 items-center py-2 border-b border-gray-100">
                <Skeleton className="h-4 w-4/12" />
                <Skeleton className="h-4 w-2/12" />
                <Skeleton className="h-4 w-2/12" />
                <Skeleton className="h-4 w-1/12" />
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

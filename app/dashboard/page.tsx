import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import { IMSStatCards } from '@/components/IMS/IMSStatCards'
import { IMSTrafficSection } from '@/components/IMS/IMSTrafficSection'
import { IMSPopularArticles } from '@/components/IMS/IMSPopularArticles'
import { IMSHotSection } from '@/components/IMS/IMSHotSection'
import { IMSPendingArticles } from '@/components/IMS/IMSPendingArticles'

export const metadata = {
  title: 'Dashboard - IMS Cổng thông tin chính',
  description: 'IMS Information Management System Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      {/* Narrow icon sidebar */}
      <IMSSidebar />

      {/* Main content area */}
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        {/* Top navigation bar */}
        <IMSTopBar />

        {/* Page content */}
        <main className="flex-1 p-4">
          <IMSStatCards />
          <IMSTrafficSection />
          <IMSPopularArticles />
          <IMSHotSection />
          <IMSPendingArticles />
        </main>
      </div>
    </div>
  )
}

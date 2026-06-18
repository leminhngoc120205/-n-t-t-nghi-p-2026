import ArticleRenderer from '@/components/ArticleRenderer';
import Link from 'next/link';

export const metadata = {
  title: 'Article | Journalism CMS',
};

export default function ArticlePage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <h1 className="text-2xl font-bold text-primary hidden sm:block">Journalism CMS</h1>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-primary transition-colors">
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ArticleRenderer articleId={params.id} />
      </main>
    </div>
  );
}

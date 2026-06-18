import Link from 'next/link';
import { FiLayout, FiEdit3, FiEye, FiDatabase } from 'react-icons/fi';

export const metadata = {
  title: 'Home | Journalism CMS',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
              J
            </div>
            <h1 className="text-2xl font-bold text-primary">Journalism CMS</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-gray-600 hover:text-primary transition-colors">
              Features
            </Link>
            <Link 
              href="/dashboard" 
              className="bg-secondary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold font-serif text-primary leading-tight">
              Professional Online Publishing Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Create visually stunning digital articles with our modern CMS designed for journalists, editors, and content creators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/dashboard"
              className="bg-secondary text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center"
            >
              Start Creating
            </Link>
            <Link
              href="/dashboard"
              className="bg-gray-200 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors text-center"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-bold text-primary">Powerful Features</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to create professional online journalism
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FiLayout className="w-12 h-12 text-secondary mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">Templates</h4>
                <p className="text-gray-600">
                  Choose from professionally designed templates for news, magazines, and interactive stories
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FiEdit3 className="w-12 h-12 text-secondary mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">Content Editor</h4>
                <p className="text-gray-600">
                  Intuitive editor with support for text, images, videos, and rich media content
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FiEye className="w-12 h-12 text-secondary mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">Live Preview</h4>
                <p className="text-gray-600">
                  See exactly how your article will look before publishing it to your audience
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <FiDatabase className="w-12 h-12 text-secondary mb-4" />
                <h4 className="text-lg font-semibold text-primary mb-2">Database Management</h4>
                <p className="text-gray-600">
                  Built-in MongoDB integration for reliable content storage and management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold text-primary">Template Categories</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect template for your content type
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500">
              <h4 className="text-xl font-bold text-primary mb-2">News Articles</h4>
              <p className="text-gray-600">
                Breaking news, daily reporting, and quick updates with modern formatting
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500">
              <h4 className="text-xl font-bold text-primary mb-2">Emagazines</h4>
              <p className="text-gray-600">
                Feature-rich magazine layouts with multiple sections and visual storytelling
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-green-500">
              <h4 className="text-xl font-bold text-primary mb-2">Longform Articles</h4>
              <p className="text-gray-600">
                In-depth investigative pieces with advanced multimedia integration
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-orange-500">
              <h4 className="text-xl font-bold text-primary mb-2">Interactive Stories</h4>
              <p className="text-gray-600">
                Engaging content with interactive elements and dynamic layouts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-4xl font-bold">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Create your first professional article in minutes with our intuitive journalism CMS
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-secondary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Creating Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold">
                J
              </div>
              <span className="font-semibold">Journalism CMS</span>
            </div>
            <p className="text-sm">© 2024 Journalism CMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

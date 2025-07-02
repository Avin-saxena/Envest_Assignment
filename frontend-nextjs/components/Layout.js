import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Bars3Icon, XMarkIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { ChartBarIcon, NewspaperIcon, BriefcaseIcon } from '@heroicons/react/24/solid';
import TourGuide from './TourGuide';

const Layout = ({ children, title = 'Insightfolio - Indian Financial News with AI Insights' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const startTour = () => {
    if (window.startInsightfolioTour) {
      window.startInsightfolioTour();
    }
  };

  const navigation = [
    { name: 'General News', href: '/', icon: NewspaperIcon },
    { name: 'Portfolio', href: '/portfolio', icon: BriefcaseIcon },
    { name: 'Filtered News', href: '/filtered', icon: ChartBarIcon },
  ];

  const isActivePath = (path) => {
    if (path === '/') return router.pathname === '/';
    return router.pathname.startsWith(path);
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="AI-powered financial news curation for Indian stock markets with sentiment analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50">
        {/* Navigation Header */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-primary-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex items-center -ml-16">
                <Link href="/" className="flex items-center space-x-3 group">
                  <div className="p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105" style={{ backgroundColor: '#3b82f6' }}>
                    <ChartBarIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary-900 to-accent-700 bg-clip-text text-transparent">
                    Insightfolio
                  </span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8 -mr-16">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 ${
                        isActivePath(item.href)
                          ? 'shadow-lg'
                          : 'hover:bg-accent-50'
                      }`}
                      style={{
                        backgroundColor: isActivePath(item.href) ? '#3b82f6' : '',
                        color: isActivePath(item.href) ? 'white' : '#475569'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActivePath(item.href)) {
                          e.currentTarget.style.color = '#3b82f6';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActivePath(item.href)) {
                          e.currentTarget.style.color = '#475569';
                        }
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
                
                {/* Tour Guide Button */}
                <button
                  onClick={startTour}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-primary-600 hover:text-accent-600 hover:bg-accent-50 transition-all duration-200 hover:scale-105"
                  title="Take a tour of Insightfolio"
                >
                  <QuestionMarkCircleIcon className="h-4 w-4" />
                  <span>Tour</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  type="button"
                  className="text-primary-600 hover:text-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 p-2 rounded-lg hover:bg-accent-50 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-primary-200 pt-4 pb-3 animate-slide-up">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                          isActivePath(item.href)
                            ? 'shadow-lg'
                            : 'hover:bg-accent-50'
                        }`}
                        style={{
                          backgroundColor: isActivePath(item.href) ? '#3b82f6' : '',
                          color: isActivePath(item.href) ? 'white' : '#475569'
                        }}
                        onMouseEnter={(e) => {
                          if (!isActivePath(item.href)) {
                            e.currentTarget.style.color = '#3b82f6';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActivePath(item.href)) {
                            e.currentTarget.style.color = '#475569';
                          }
                        }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Mobile Tour Button */}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      startTour();
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-accent-50 text-primary-600 hover:text-accent-600 w-full text-left"
                  >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                    <span>Take Tour</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        {/* Tour Guide */}
        <TourGuide />

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md border-t border-primary-200 mt-16">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm font-medium text-primary-700">
                &copy; 2025 Insightfolio. Built with Next.js and powered by Gemini AI.
              </p>
              <p className="text-xs mt-2 text-primary-500">
                News sources: Economic Times & LiveMint
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout; 
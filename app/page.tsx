import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/20 via-black to-black"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-scale-in">
            Discover Your Next
            <span className="gradient-text block mt-2">Favorite Film</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 animate-fade-in">
            Explore thousands of films, share reviews, and connect with fellow movie enthusiasts
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link
              href="/films"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all btn-glow"
            >
              Browse Films
            </Link>
            <Link
              href="/register"
              className="glass hover:bg-gray-800/80 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose <span className="gradient-text">FilmHub</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-xl hover:bg-gray-800/80 transition-all card-hover">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Vast Collection</h3>
            <p className="text-gray-400">
              Browse through thousands of films across all genres and eras
            </p>
          </div>

          <div className="glass p-8 rounded-xl hover:bg-gray-800/80 transition-all card-hover">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Rate & Review</h3>
            <p className="text-gray-400">
              Share your thoughts and discover what others think about films
            </p>
          </div>

          <div className="glass p-8 rounded-xl hover:bg-gray-800/80 transition-all card-hover">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Personal Lists</h3>
            <p className="text-gray-400">
              Create and manage your watchlist, track what you've watched
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="glass p-12 rounded-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of film enthusiasts today
          </p>
          <Link
            href="/register"
            className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all btn-glow"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}

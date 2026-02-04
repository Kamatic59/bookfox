import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Logo, FoxIcon } from '../components/Logo';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, businessName);
      navigate('/onboarding');
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/30 to-stone-50 flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-blue-700 items-center justify-center p-12 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="relative z-10 max-w-md">
          <div className="mb-8">
            <FoxIcon size={120} className="drop-shadow-2xl" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 2,500+ trade pros
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Start catching every missed call and converting more leads in less than 5 minutes.
          </p>

          <div className="space-y-4">
            {[
              { icon: '✓', text: '14-day free trial, no credit card required' },
              { icon: '✓', text: 'Setup in under 5 minutes' },
              { icon: '✓', text: 'Cancel anytime, no questions asked' },
              { icon: '✓', text: 'Works with your existing phone number' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-blue-50">
                <span className="w-6 h-6 rounded-full bg-blue-500/30 flex items-center justify-center text-sm">
                  {item.icon}
                </span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="mt-12 bg-blue-500/20 backdrop-blur rounded-2xl p-6">
            <p className="text-blue-50 italic mb-4">
              "BookFox paid for itself in the first week. I booked 3 jobs I would have missed completely."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
                M
              </div>
              <div>
                <p className="text-white font-medium">Mike Johnson</p>
                <p className="text-blue-200 text-sm">Johnson Plumbing Co.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="inline-block mb-8">
            <Logo size="lg" />
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-stone-800">Start your free trial</h1>
            <p className="text-stone-600 mt-2">No credit card required. Get started in minutes.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-stone-700 mb-2">
                Business name
              </label>
              <input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-stone-400"
                placeholder="Acme Plumbing"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                Work email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-stone-400"
                placeholder="you@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
                Create password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-stone-400"
                placeholder="••••••••"
                minLength={6}
                required
              />
              <p className="text-xs text-stone-500 mt-2">Must be at least 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Start Free 14-Day Trial'
              )}
            </button>

            <p className="text-center text-xs text-stone-500">
              By signing up, you agree to our{' '}
              <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gradient-to-br from-stone-50 via-blue-50/30 to-stone-50 text-stone-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="block w-full py-3.5 px-4 bg-white text-stone-700 font-semibold rounded-xl hover:bg-stone-50 border border-stone-300 text-center transition-all"
            >
              Sign in instead
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

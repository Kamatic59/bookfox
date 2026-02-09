import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// ROI Calculator Component
function ROICalculator() {
  const [leads, setLeads] = useState(50);
  const [jobValue, setJobValue] = useState(3000);
  const [missRate, setMissRate] = useState(40);
  const [showResult, setShowResult] = useState(false);

  const monthlyLoss = Math.round((leads * (missRate / 100) * jobValue));
  const yearlyLoss = monthlyLoss * 12;
  const roi = Math.round(monthlyLoss / 299);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200">
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-stone-700">How many leads do you get per month?</label>
            <span className="text-blue-600 font-bold">{leads}</span>
          </div>
          <input
            type="range"
            min="10"
            max="200"
            value={leads}
            onChange={(e) => setLeads(Number(e.target.value))}
            className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-stone-700">What's your average job value?</label>
            <span className="text-blue-600 font-bold">${jobValue.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="500"
            max="20000"
            step="500"
            value={jobValue}
            onChange={(e) => setJobValue(Number(e.target.value))}
            className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-semibold text-stone-700">What % of leads do you miss or respond to slowly?</label>
            <span className="text-blue-600 font-bold">{missRate}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="70"
            value={missRate}
            onChange={(e) => setMissRate(Number(e.target.value))}
            className="w-full h-3 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <button
          onClick={() => setShowResult(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
        >
          Calculate My Losses
        </button>

        {showResult && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 text-center animate-fadeIn">
            <p className="text-stone-600 mb-2">You're losing approximately</p>
            <p className="text-5xl font-bold text-red-600 mb-2">${monthlyLoss.toLocaleString()}</p>
            <p className="text-stone-600 mb-4">per month in missed opportunities</p>
            
            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-stone-500 text-sm">BookFox costs <span className="font-bold text-stone-800">$299/month</span></p>
              <p className="text-3xl font-bold text-emerald-600">ROI: {roi}x</p>
              <p className="text-stone-500 text-sm mt-1">That's <span className="font-bold text-red-600">${yearlyLoss.toLocaleString()}</span> left on the table every year</p>
            </div>

            <Link
              to="/signup"
              className="inline-block w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg shadow-emerald-500/30"
            >
              Start Free Trial — Stop Losing Money
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Testimonial with results
function TestimonialCard({ quote, name, business, location, result, resultLabel }) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-stone-100 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-400">★</span>
        ))}
      </div>
      <p className="text-stone-700 text-lg mb-6 leading-relaxed flex-1">"{quote}"</p>
      <div className="border-t border-stone-100 pt-4 mt-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-stone-800">{name}</p>
            <p className="text-stone-500 text-sm">{business}, {location}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-emerald-600">{result}</p>
            <p className="text-xs text-stone-500">{resultLabel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Item
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-semibold text-stone-800 pr-4">{question}</span>
        <span className={`text-blue-600 text-2xl transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-stone-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-center py-2.5 px-4 text-sm font-medium">
        ⚠️ Limited Availability: Only taking <span className="font-bold">15 new clients</span> this month to ensure quality service. <span className="font-bold">7 spots remaining.</span>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
              <span className="text-xl font-bold text-stone-800">
                Book<span className="text-blue-600">Fox</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-stone-600 hover:text-stone-800 transition">How It Works</a>
              <a href="#pricing" className="text-stone-600 hover:text-stone-800 transition">Pricing</a>
              <a href="#faq" className="text-stone-600 hover:text-stone-800 transition">FAQ</a>
              <Link to="/login" className="text-stone-600 hover:text-stone-800 transition">Sign In</Link>
              <Link 
                to="/signup" 
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/25"
              >
                Start Free Trial
              </Link>
            </div>

            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200 py-4 px-4 space-y-1">
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 rounded-xl">How It Works</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 rounded-xl">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-3 px-4 text-stone-600 hover:bg-stone-50 rounded-xl">FAQ</a>
            <Link to="/login" className="block py-3 px-4 text-stone-600 hover:bg-stone-50 rounded-xl">Sign In</Link>
            <Link to="/signup" className="block bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-center mt-2">
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION - FIX #1 */}
      <section className="pt-12 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 mb-6 leading-[1.1]">
              Stop Losing <span className="text-red-500">$10,000+</span> Every Month In Leads That Go To Your Competitors
            </h1>
            
            <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              BookFox responds to every lead in under 60 seconds — even when you're on a roof, in a crawl space, or with a customer. Built specifically for <span className="font-semibold text-stone-800">HVAC, Roofing, and Plumbing contractors</span> in Utah.
            </p>
            
            <Link 
              to="/signup" 
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-xl font-bold text-lg sm:text-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Free 14-Day Trial — No Credit Card Required
            </Link>
            
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 text-stone-500 text-sm">
              <span className="flex items-center gap-1.5">⚡ Setup in 15 minutes</span>
              <span className="flex items-center gap-1.5">💬 Books appointments while you work</span>
              <span className="flex items-center gap-1.5">❌ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - FIX #2 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-4">
            Contractors Are Booking More Jobs With BookFox
          </h2>
          <p className="text-stone-500 text-center mb-12">Real results from real contractors in Utah</p>

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="We were losing leads left and right because I couldn't respond fast enough. BookFox booked 8 extra jobs in the first 3 weeks. Paid for itself 40x over."
              name="Mike Peterson"
              business="Peterson HVAC"
              location="Lehi UT"
              result="+$18,000"
              resultLabel="first month revenue"
            />
            <TestimonialCard
              quote="I was skeptical about AI, but customers love the instant response. Nobody realizes it's not me texting. Game changer."
              name="Sarah Chen"
              business="Summit Roofing"
              location="Draper UT"
              result="73%"
              resultLabel="response rate (up from 31%)"
            />
            <TestimonialCard
              quote="Setup took 12 minutes. Now I never miss a lead even when I'm elbow-deep in a furnace repair."
              name="Carlos Martinez"
              business="Wasatch Plumbing"
              location="Salt Lake City"
              result="127"
              resultLabel="leads handled, month 1"
            />
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR - FIX #3 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-100 to-blue-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-4">
            How Much Are You Losing Right Now?
          </h2>
          <p className="text-stone-500 text-center mb-10">Adjust the sliders to see your potential losses</p>
          <ROICalculator />
        </div>
      </section>

      {/* FEATURES - FIX #4 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-4">
            How BookFox Gets You More Jobs
          </h2>
          <p className="text-stone-500 text-center mb-12 max-w-2xl mx-auto">
            Built by contractors, for contractors. Every feature designed to put more money in your pocket.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-blue-500/30">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Instant Response (Even When You're Busy)</h3>
              <p className="text-stone-600 mb-4">
                Lead comes in while you're up on a roof? BookFox responds in under 60 seconds via text. No more losing jobs because you called back 3 hours later.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Works 24/7 — nights, weekends, holidays
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Responds via text (how customers actually want to communicate)
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Never forgets to follow up
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-amber-500/30">
                🎯
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Smart Qualification (Only Sends You Hot Leads)</h3>
              <p className="text-stone-600 mb-4">
                Not every lead is ready to buy. BookFox asks the right questions to figure out:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-amber-500">•</span> Is this an emergency or just browsing?
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-amber-500">•</span> What's their timeline?
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-amber-500">•</span> What's their budget range?
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-amber-500">•</span> Are they talking to other contractors?
                </li>
              </ul>
              <p className="text-stone-600 mt-4 font-medium">You only get notified when they're ready to book. No more wasting time on tire-kickers.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-emerald-500/30">
                📅
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Books Appointments Directly Into Your Calendar</h3>
              <p className="text-stone-600 mb-4">
                Once BookFox qualifies the lead, it checks your availability and books them into your calendar — without you touching your phone.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Integrates with Google Calendar, Outlook, or any calendar
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Sends automatic reminders so they show up
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-emerald-500">✓</span> Handles rescheduling if they need to move it
                </li>
              </ul>
              <p className="text-stone-600 mt-4 font-medium">You just show up to jobs that are already booked.</p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-2xl mb-5 shadow-lg shadow-purple-500/30">
                💬
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-3">Sounds Like A Real Person (Not A Robot)</h3>
              <p className="text-stone-600 mb-4">
                Your customers have no idea they're talking to AI. BookFox:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-purple-500">•</span> Uses natural, conversational language
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-purple-500">•</span> Adapts to how they text (formal or casual)
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-purple-500">•</span> Remembers context from earlier in the conversation
                </li>
                <li className="flex items-center gap-2 text-stone-700">
                  <span className="text-purple-500">•</span> Never sounds scripted or robotic
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - FIX #5 */}
      <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-700">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-4">
            Get Started In 3 Simple Steps
          </h2>
          <p className="text-blue-100 text-center mb-12">You'll be live and catching leads today</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">
                📞
              </div>
              <h3 className="text-xl font-bold text-white mb-2">15-Minute Setup Call</h3>
              <p className="text-blue-100">We connect BookFox to your existing lead sources (website forms, Facebook, Google, missed calls). Takes 15 minutes, we do it with you.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">
                🤖
              </div>
              <h3 className="text-xl font-bold text-white mb-2">BookFox Learns Your Business</h3>
              <p className="text-blue-100">We customize how BookFox talks based on your services, pricing, and availability. You approve the script before it goes live.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-white/10 backdrop-blur rounded-2xl flex items-center justify-center text-4xl mx-auto mb-5">
                💰
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Start Booking More Jobs</h3>
              <p className="text-blue-100">BookFox handles every lead 24/7. You get real-time notifications when someone's ready to book. That's it.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link 
              to="/signup" 
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-xl"
            >
              Start Free 14-Day Trial
            </Link>
          </div>
        </div>
      </section>

      {/* GUARANTEE - FIX #6 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 mb-8">
            Try BookFox Risk-Free
          </h2>
          
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-3xl p-8 sm:p-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-500 rounded-full text-white text-4xl mb-6 shadow-lg shadow-emerald-500/30">
              ✓
            </div>
            
            <div className="space-y-4 text-lg text-stone-700 mb-8">
              <p className="flex items-center justify-center gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>14-Day Free Trial — No Credit Card Required</span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>If BookFox Doesn't Book At Least One Extra Job In Your First Month, We'll Refund You 100%</span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Cancel Anytime — No Contracts, No Hassle</span>
              </p>
              <p className="flex items-center justify-center gap-3">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Setup Included — We Do It With You On A Call</span>
              </p>
            </div>

            <p className="text-stone-600 max-w-2xl mx-auto">
              We're so confident BookFox will book you more jobs that we're putting our money where our mouth is. Try it completely free for 14 days. If you don't see results, you pay nothing.
            </p>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE - FIX #14 */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-stone-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-12">
            BookFox vs. Doing It Yourself vs. Hiring Someone
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead className="bg-stone-800 text-white">
                <tr>
                  <th className="py-4 px-6 text-left font-semibold"></th>
                  <th className="py-4 px-6 text-center font-semibold">Doing It Yourself</th>
                  <th className="py-4 px-6 text-center font-semibold">Hiring A Person</th>
                  <th className="py-4 px-6 text-center font-semibold bg-blue-600">BookFox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="py-4 px-6 font-medium text-stone-700">Response Time</td>
                  <td className="py-4 px-6 text-center text-stone-500">2-4 hours</td>
                  <td className="py-4 px-6 text-center text-stone-500">10-30 minutes</td>
                  <td className="py-4 px-6 text-center font-bold text-blue-600 bg-blue-50">Under 60 seconds</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="py-4 px-6 font-medium text-stone-700">Cost</td>
                  <td className="py-4 px-6 text-center text-stone-500">Your time + lost leads</td>
                  <td className="py-4 px-6 text-center text-stone-500">$3,000-5,000/month</td>
                  <td className="py-4 px-6 text-center font-bold text-blue-600 bg-blue-50">$299/month</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-stone-700">Works 24/7?</td>
                  <td className="py-4 px-6 text-center text-red-500">❌ No</td>
                  <td className="py-4 px-6 text-center text-red-500">❌ No</td>
                  <td className="py-4 px-6 text-center text-emerald-500 bg-blue-50">✓ Yes</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="py-4 px-6 font-medium text-stone-700">Never Misses A Lead?</td>
                  <td className="py-4 px-6 text-center text-red-500">❌ No</td>
                  <td className="py-4 px-6 text-center text-red-500">❌ Sometimes</td>
                  <td className="py-4 px-6 text-center text-emerald-500 bg-blue-50">✓ Yes</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-medium text-stone-700">Qualifies Leads?</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✓ Yes</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✓ Yes</td>
                  <td className="py-4 px-6 text-center text-emerald-500 bg-blue-50">✓ Yes</td>
                </tr>
                <tr className="bg-stone-50">
                  <td className="py-4 px-6 font-medium text-stone-700">Books Appointments?</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✓ Yes</td>
                  <td className="py-4 px-6 text-center text-emerald-500">✓ Yes</td>
                  <td className="py-4 px-6 text-center text-emerald-500 bg-blue-50">✓ Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PRICING - FIX #10 */}
      <section id="pricing" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-stone-500 text-center mb-12">All plans include a 14-day free trial</p>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Starter */}
            <div className="bg-white rounded-2xl p-8 border-2 border-stone-200 hover:border-blue-200 transition-colors">
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Starter</h3>
              <p className="text-stone-500 mb-4">Best for solo contractors</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-stone-800">$197</span>
                <span className="text-stone-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Up to 50 leads/month',
                  'Text & email response',
                  'Basic qualification',
                  'Calendar integration',
                  'Setup included',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-600">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 text-center bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Professional */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-2xl shadow-blue-500/30 scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full">⭐ MOST POPULAR</span>
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-2">Professional</h3>
              <p className="text-blue-100 mb-4">For contractors serious about growth</p>
              <div className="mb-6">
                <span className="text-5xl font-bold">$397</span>
                <span className="text-blue-100">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited leads',
                  'Advanced qualification',
                  'Missed call text-back',
                  'Custom AI training',
                  'Priority support',
                  'Setup included',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-blue-50">
                    <span className="text-blue-200">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 text-center bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white rounded-2xl p-8 border-2 border-stone-200 hover:border-blue-200 transition-colors">
              <h3 className="text-2xl font-bold text-stone-800 mb-2">Enterprise</h3>
              <p className="text-stone-500 mb-4">For multi-location companies</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-stone-800">$697</span>
                <span className="text-stone-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Everything in Professional',
                  'Multi-location support',
                  'Custom integrations',
                  'Dedicated account manager',
                  'Monthly strategy calls',
                  'White-glove setup',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-stone-600">
                    <span className="text-emerald-500">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="block w-full py-3 text-center bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ - FIX #7 */}
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-800 text-center mb-12">
            Common Questions
          </h2>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg">
            <FAQItem
              question="Will my customers know they're talking to AI?"
              answer="Nope. BookFox sounds completely natural and conversational. 90%+ of customers have no idea. They just appreciate the instant response."
            />
            <FAQItem
              question="What if BookFox says something wrong or makes a mistake?"
              answer="You review and approve all responses before BookFox goes live. Plus, if it's ever unsure about something, it automatically escalates to you. You stay in full control."
            />
            <FAQItem
              question="Is this hard to set up?"
              answer="Not at all. We do a 15-minute setup call with you where we connect everything. You'll be live and responding to leads the same day."
            />
            <FAQItem
              question="What happens to leads that come in right now?"
              answer="BookFox responds to every lead — website forms, Facebook messages, Google leads, even missed phone calls (we can set it to auto-text people you miss)."
            />
            <FAQItem
              question="Do I need to change my phone number or website?"
              answer="No. BookFox works with whatever you're already using. No changes needed."
            />
            <FAQItem
              question="What if I'm already responding to leads quickly?"
              answer="Even if you respond in 30 minutes, you're still losing leads. Studies show the first company to respond gets the job 78% of the time. Unless you're responding in under 60 seconds (even at 2am), you're leaving money on the table."
            />
            <FAQItem
              question="Can I customize what BookFox says?"
              answer="Absolutely. We customize it to match your brand, services, and how you like to communicate. You approve everything before it goes live."
            />
            <FAQItem
              question="What if I get a lead while BookFox is talking to another lead?"
              answer="BookFox handles unlimited simultaneous conversations. It can talk to 50 people at once if needed. You'll never miss a lead because you're 'busy.'"
            />
            <FAQItem
              question="How much does it cost after the trial?"
              answer="Plans start at $197/month. If BookFox books you even one extra $3,000 job per month, it's paid for itself 15x over. Most contractors book 5-10 extra jobs per month."
            />
            <FAQItem
              question="What if I want to cancel?"
              answer="Cancel anytime with one click. No contracts, no cancellation fees, no questions asked."
            />
          </div>
        </div>
      </section>

      {/* TRUST BADGES - FIX #11 */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-y border-stone-200">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 text-stone-400 text-sm">
            <span className="flex items-center gap-2">🏔️ Built in Utah, for Utah contractors</span>
            <span className="flex items-center gap-2">🔒 Bank-level security & encryption</span>
            <span className="flex items-center gap-2">✓ TCPA compliant</span>
            <span className="flex items-center gap-2">⭐ Trusted by 50+ contractors</span>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-stone-900 to-stone-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Every Day You Wait Costs You $300-500 In Lost Leads
          </h2>
          <p className="text-xl text-stone-300 mb-8">
            Your competitors are responding to leads in 60 seconds. How fast are you responding?
          </p>
          <Link 
            to="/signup" 
            className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-xl shadow-blue-500/30"
          >
            Start Free 14-Day Trial — No Credit Card Required
          </Link>
          <p className="text-stone-400 text-sm mt-4">Setup in 15 minutes • Cancel anytime • 100% money-back guarantee</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
                <span className="text-xl font-bold text-white">
                  Book<span className="text-blue-400">Fox</span>
                </span>
              </div>
              <p className="text-sm">
                AI-powered receptionist for trade businesses. Never miss a lead again.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center text-sm">
            <p>© 2026 BookFox. All rights reserved. Built with ❤️ in Utah.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

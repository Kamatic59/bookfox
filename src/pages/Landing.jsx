import { Link } from 'react-router-dom';
import { useState } from 'react';

// ROI Calculator
function ROICalculator() {
  const [leads, setLeads] = useState(50);
  const [jobValue, setJobValue] = useState(3000);
  const [missRate, setMissRate] = useState(40);
  const [showResult, setShowResult] = useState(false);

  const monthlyLoss = Math.round((leads * (missRate / 100) * jobValue));
  const yearlyLoss = monthlyLoss * 12;
  const roi = Math.round(monthlyLoss / 299);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-stone-200">
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-stone-700">Leads per month</label>
            <span className="text-blue-600 font-bold">{leads}</span>
          </div>
          <input
            type="range" min="10" max="200" value={leads}
            onChange={(e) => { setLeads(Number(e.target.value)); setShowResult(false); }}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-stone-700">Average job value</label>
            <span className="text-blue-600 font-bold">${jobValue.toLocaleString()}</span>
          </div>
          <input
            type="range" min="500" max="20000" step="500" value={jobValue}
            onChange={(e) => { setJobValue(Number(e.target.value)); setShowResult(false); }}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-stone-700">% of leads missed or slow response</label>
            <span className="text-blue-600 font-bold">{missRate}%</span>
          </div>
          <input
            type="range" min="10" max="70" value={missRate}
            onChange={(e) => { setMissRate(Number(e.target.value)); setShowResult(false); }}
            className="w-full h-2 bg-stone-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <button
          onClick={() => setShowResult(true)}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
        >
          Calculate My Losses
        </button>

        {showResult && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 text-center">
            <p className="text-stone-600 mb-1">You're losing</p>
            <p className="text-4xl font-bold text-red-600 mb-1">${monthlyLoss.toLocaleString()}/month</p>
            <p className="text-stone-500 text-sm mb-4">That's ${yearlyLoss.toLocaleString()} per year</p>
            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-stone-600">BookFox costs <span className="font-bold">$299/month</span></p>
              <p className="text-2xl font-bold text-emerald-600">{roi}x ROI</p>
            </div>
            <Link to="/signup" className="block w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition">
              Start Free Trial — Stop Losing Money
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// FAQ Item
function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-stone-200 last:border-0">
      <button onClick={() => setOpen(!open)} className="w-full py-4 flex justify-between items-center text-left">
        <span className="font-semibold text-stone-800 pr-4">{q}</span>
        <span className={`text-blue-600 text-xl transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-4 text-stone-600">{a}</p>}
    </div>
  );
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="BookFox" className="w-9 h-9" />
            <span className="text-xl font-bold text-stone-800">Book<span className="text-blue-600">Fox</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <a href="#how-it-works" className="text-stone-600 hover:text-stone-800">How It Works</a>
            <a href="#pricing" className="text-stone-600 hover:text-stone-800">Pricing</a>
            <Link to="/login" className="text-stone-600 hover:text-stone-800">Sign In</Link>
            <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
              Start Free Trial
            </Link>
          </div>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white/90 backdrop-blur-lg border-t border-white/50 p-4 space-y-2">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600">How It Works</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block py-2 text-stone-600">Pricing</a>
            <Link to="/login" className="block py-2 text-stone-600">Sign In</Link>
            <Link to="/signup" className="block bg-blue-600 text-white py-3 rounded-lg font-semibold text-center">Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* SECTION 1: HERO */}
      <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 relative overflow-hidden">
        {/* Decorative gradient blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 mb-4 leading-tight">
            Never Miss Another Lead
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-6 max-w-2xl mx-auto">
            AI responds to every lead in 60 seconds — even when you're busy
          </p>
          <p className="text-stone-500 text-sm mb-8 flex flex-wrap items-center justify-center gap-4">
            <span>⚡ 15-min setup</span>
            <span>💬 Works 24/7</span>
            <span>❌ Cancel anytime</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/signup" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/25">
              Start Free 14-Day Trial — No Credit Card
            </Link>
            <a href="#demo" className="w-full sm:w-auto text-stone-600 font-medium hover:text-blue-600 px-6 py-4 flex items-center justify-center gap-2">
              <span className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center">▶</span>
              Watch 60-Second Demo
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 2: SOCIAL PROOF */}
      <section className="py-16 px-4 bg-white/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
            Contractors Are Booking More Jobs With BookFox
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { stars: 5, quote: "Booked 8 extra jobs in 3 weeks", name: "Mike Peterson", biz: "Peterson HVAC", result: "+$18,000", sub: "first month" },
              { stars: 5, quote: "Customers love the instant response", name: "Sarah Chen", biz: "Summit Roofing", result: "73%", sub: "response rate (up from 31%)" },
              { stars: 5, quote: "Setup took 12 minutes", name: "Carlos Martinez", biz: "Wasatch Plumbing", result: "127", sub: "leads responded, month 1" },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <div className="text-amber-400 mb-3">{'★'.repeat(t.stars)}</div>
                <p className="text-stone-800 font-medium mb-4">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-stone-700 text-sm">{t.name}</p>
                    <p className="text-stone-500 text-xs">{t.biz}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">{t.result}</p>
                    <p className="text-xs text-stone-500">{t.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-10">
            You're Losing Leads Every Single Day
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div>
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⏰</div>
              <h3 className="font-bold text-stone-800 mb-2">Lead comes in at 2pm</h3>
              <p className="text-stone-600">You're on a roof or with a customer</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📱</div>
              <h3 className="font-bold text-stone-800 mb-2">You call back at 5pm</h3>
              <p className="text-stone-600">3 hours later when you're free</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">❌</div>
              <h3 className="font-bold text-stone-800 mb-2">They already hired someone else</h3>
              <p className="text-stone-600">First to respond wins 78% of the time</p>
            </div>
          </div>
          <p className="text-xl font-bold text-red-600 mb-6">Every missed lead costs you $2,000-$10,000</p>
          <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section id="how-it-works" className="py-16 px-4 bg-blue-600">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-10">How BookFox Works</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {[
              { icon: "📞", title: "Lead Comes In", desc: "From your website, Facebook, Google, or missed calls" },
              { icon: "🤖", title: "BookFox Responds Instantly", desc: "In under 60 seconds via text. Qualifies them. Books appointment." },
              { icon: "✅", title: "You Get Notified", desc: "Only when they're ready to book. You just show up and do the job." },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">{s.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-blue-100">{s.desc}</p>
              </div>
            ))}
          </div>
          <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition">
            Start Free Trial
          </Link>
        </div>
      </section>

      {/* SECTION 5: SHOW IT IN ACTION */}
      <section id="demo" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">See A Real Conversation</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Phone mockup */}
            <div className="bg-stone-900 rounded-[2.5rem] p-3 shadow-2xl max-w-xs mx-auto">
              <div className="bg-white rounded-[2rem] overflow-hidden">
                <div className="bg-stone-100 px-4 py-2 text-center text-xs text-stone-500">Messages</div>
                <div className="p-4 space-y-3 min-h-[350px]">
                  <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Hey I need my AC fixed, it's not cooling</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                    <p className="text-sm">I can help! Is this an emergency or can it wait a day or two?</p>
                  </div>
                  <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">Pretty urgent, it's 95 degrees in here</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                    <p className="text-sm">Got it. I can get someone out today at 2pm or 4pm. Which works better?</p>
                  </div>
                  <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                    <p className="text-sm">2pm works</p>
                  </div>
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                    <p className="text-sm">Perfect! You're booked for 2pm today. I'll send a reminder. See you then! 🙂</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Text */}
            <div>
              <h3 className="text-xl font-bold text-stone-800 mb-4">Your customers have no idea it's AI</h3>
              <ul className="space-y-3 mb-6">
                {[
                  "Sounds natural and friendly",
                  "Asks the right questions",
                  "Books appointments directly",
                  "Works 24/7, even at 2am",
                ].map((t, i) => (
                  <li key={i} className="flex items-center gap-3 text-stone-700">
                    <span className="text-emerald-500 text-lg">✓</span> {t}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FEATURES */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
            Everything You Need To Capture Every Lead
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: "⚡", title: "60-Second Response Time", desc: "Responds instantly via text — the way customers want. Works 24/7, even holidays." },
              { icon: "🎯", title: "Smart Qualification", desc: "Asks the right questions to figure out if they're ready to buy. Only notifies you about hot leads." },
              { icon: "📅", title: "Automatic Booking", desc: "Checks your calendar and books appointments without you touching your phone. Sends reminders too." },
              { icon: "🔗", title: "Works With Everything", desc: "Connects to your website, Facebook, Google, Yelp, missed calls — wherever leads come from." },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-stone-800 mb-2">{f.title}</h3>
                <p className="text-stone-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: ROI CALCULATOR */}
      <section className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-4">
            How Much Are You Losing Right Now?
          </h2>
          <p className="text-stone-500 text-center mb-8">Drag the sliders to see your potential losses</p>
          <ROICalculator />
        </div>
      </section>

      {/* SECTION 8: COMPARISON TABLE */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-10">
            BookFox vs. Doing It Yourself vs. Hiring Someone
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-sm overflow-hidden text-sm">
              <thead className="bg-stone-800 text-white">
                <tr>
                  <th className="py-3 px-4 text-left"></th>
                  <th className="py-3 px-4 text-center">You Do It</th>
                  <th className="py-3 px-4 text-center">Hire Someone</th>
                  <th className="py-3 px-4 text-center bg-blue-600">BookFox</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {[
                  ["Response Time", "2-4 hours", "10-30 min", "60 seconds"],
                  ["Cost/Month", "Lost jobs", "$3k-5k", "$299"],
                  ["Works 24/7", "❌", "❌", "✓"],
                  ["Never Misses", "❌", "Sometimes", "✓"],
                  ["Setup Time", "N/A", "Weeks", "15 min"],
                ].map((row, i) => (
                  <tr key={i} className={i % 2 ? 'bg-stone-50' : ''}>
                    <td className="py-3 px-4 font-medium text-stone-700">{row[0]}</td>
                    <td className="py-3 px-4 text-center text-stone-500">{row[1]}</td>
                    <td className="py-3 px-4 text-center text-stone-500">{row[2]}</td>
                    <td className="py-3 px-4 text-center font-semibold text-blue-600 bg-blue-50">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-center mt-8">
            <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 9: GUARANTEE */}
      <section id="pricing" className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 mb-8">Try BookFox Completely Risk-Free</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              "14-Day Free Trial",
              "No Credit Card Required",
              "Cancel Anytime",
              "Money-Back Guarantee",
            ].map((g, i) => (
              <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <span className="text-emerald-600 font-bold text-lg">✓</span>
                <p className="text-stone-700 font-medium text-sm mt-1">{g}</p>
              </div>
            ))}
          </div>
          <p className="text-stone-600 max-w-xl mx-auto mb-8">
            If BookFox doesn't book you at least one extra job in your first month, we'll refund you 100%. No questions asked.
          </p>
          <Link to="/signup" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/25">
            Start Your Free Trial — Zero Risk
          </Link>
        </div>
      </section>

      {/* SECTION 10: FAQ */}
      <section className="py-16 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 text-center mb-8">Common Questions</h2>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <FAQItem q="Will customers know it's AI?" a="Nope. Sounds completely natural. 90%+ have no idea." />
            <FAQItem q="What if it makes a mistake?" a="You review everything before it goes live. Plus it escalates to you if unsure." />
            <FAQItem q="Hard to set up?" a="15-minute call. We do it with you. You're live same day." />
            <FAQItem q="What if I want to cancel?" a="One-click cancel. No contracts. No fees." />
            <FAQItem q="How much after the trial?" a="$299/month. One extra job pays for 10+ months." />
            <FAQItem q="Works with my calendar?" a="Yes. Google Calendar, Outlook, whatever you use." />
          </div>
        </div>
      </section>

      {/* SECTION 11: FINAL CTA */}
      <section className="py-20 px-4 bg-stone-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Start Capturing Every Lead Today</h2>
          <p className="text-stone-400 mb-8">Join 50+ contractors who never miss another lead</p>
          <Link to="/signup" className="inline-block bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg">
            Start Free 14-Day Trial — No Credit Card Required
          </Link>
          <p className="text-stone-500 text-sm mt-4">Setup takes 15 minutes. You'll be responding to leads in under an hour.</p>
          <p className="text-stone-600 text-xs mt-6">Questions? Email hello@bookfox.ai</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-4 bg-stone-900 border-t border-stone-800">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BookFox" className="w-8 h-8" />
            <span className="text-white font-bold">Book<span className="text-blue-400">Fox</span></span>
          </div>
          <p className="text-stone-500 text-sm">© 2026 BookFox. All rights reserved.</p>
          <div className="flex gap-4 text-stone-500 text-sm">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useState } from 'react';

// FAQ Item
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full py-5 flex justify-between items-center text-left"
      >
        <span className="font-semibold text-slate-800 text-lg pr-4">{q}</span>
        <span className={`text-slate-400 text-2xl transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-5 text-slate-600 text-lg leading-relaxed">{a}</p>}
    </div>
  );
}

// CTA Button - consistent everywhere
function CTAButton({ children, className = '' }) {
  return (
    <Link 
      to="/signup" 
      className={`inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-lg transition active:scale-[0.98] ${className}`}
    >
      {children}
    </Link>
  );
}

// Secondary CTA
function SecondaryCTA({ children, href = '#demo' }) {
  return (
    <a 
      href={href}
      className="inline-flex items-center gap-2 text-slate-600 font-medium hover:text-slate-800 transition"
    >
      <span className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">▶</span>
      {children}
    </a>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* ========== SECTION 1: HERO ========== */}
      {/* No nav bar - straight to the point */}
      <section className="min-h-screen flex items-center px-6 py-12 lg:py-0">
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left: Copy */}
            <div>
              {/* Logo - small, not distracting */}
              <div className="flex items-center gap-2 mb-8">
                <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
                <span className="text-xl font-bold text-slate-800">Book<span className="text-blue-600">Fox</span></span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Never Miss Another Job Because You Didn't Answer the Phone
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                BookFox answers calls, qualifies leads, and books jobs for plumbers, HVAC, electricians, and contractors — 24/7.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <CTAButton>See How It Books Jobs Automatically</CTAButton>
                <SecondaryCTA>Watch 60-Second Demo</SecondaryCTA>
              </div>
              
              <p className="text-slate-500 text-sm">No credit card required. Setup in 15 minutes.</p>
            </div>
            
            {/* Right: Visual - Simple phone/chat mock */}
            <div className="hidden lg:block">
              <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl max-w-sm ml-auto">
                <div className="bg-white rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="ml-2 text-sm text-slate-500">Incoming Call</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="font-medium text-slate-800">Customer calls at 9pm</p>
                        <p className="text-sm">You're at dinner with family</p>
                      </div>
                    </div>
                    <div className="border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50 rounded-r">
                      <p className="font-medium text-emerald-800">BookFox answers instantly</p>
                      <p className="text-sm text-emerald-600">"Hi! Thanks for calling. How can we help you today?"</p>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="text-2xl">📝</span>
                      <div>
                        <p className="font-medium text-slate-800">Qualifies the lead</p>
                        <p className="text-sm">Emergency? Budget? Location?</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <span className="text-2xl">📅</span>
                      <div>
                        <p className="font-medium text-slate-800">Books the job</p>
                        <p className="text-sm">Tomorrow at 2pm — confirmed</p>
                      </div>
                    </div>
                    <div className="bg-slate-900 text-white rounded-xl p-4 text-center">
                      <p className="text-sm text-slate-400">You wake up to:</p>
                      <p className="font-bold text-lg">$3,200 job booked ✓</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: THE PAIN ========== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            Every Missed Call Is Money You'll Never Get Back
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: "📵", text: "Customers don't leave voicemails — they call the next contractor" },
              { icon: "🌙", text: "After-hours calls go unanswered while competitors scoop them up" },
              { icon: "😤", text: "You're stuck answering phones instead of running jobs" },
              { icon: "💸", text: "Hiring a receptionist is expensive and unreliable" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-white p-6 rounded-xl border border-slate-200">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-lg text-slate-700">{item.text}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xl text-slate-600 mt-10">
            Miss 5 calls a week? That's easily <span className="font-bold text-red-600">$2,000–5,000/month</span> walking out the door.
          </p>
        </div>
      </section>

      {/* ========== SECTION 3: THE SOLUTION ========== */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-4">
            BookFox Fixes This
          </h2>
          <p className="text-xl text-slate-600 text-center mb-12">
            Your AI receptionist that actually works.
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: "📞", title: "Answers Every Call", desc: "Never miss a lead — even nights and weekends." },
              { icon: "🎯", title: "Qualifies Customers", desc: "Filters out tire-kickers and wrong-fit jobs." },
              { icon: "📅", title: "Books Jobs Automatically", desc: "Syncs with your calendar or sends confirmed leads." },
              { icon: "💰", title: "Costs Less Than an Employee", desc: "No sick days. No payroll. No training." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <CTAButton>See How It Books Jobs Automatically</CTAButton>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: HOW IT WORKS ========== */}
      <section id="demo" className="py-20 px-6 bg-blue-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-xl text-blue-200 text-center mb-12">
            Simple enough to explain in 10 seconds.
          </p>
          
          <div className="grid sm:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Customer calls", desc: "Your business number" },
              { num: "2", title: "BookFox answers", desc: "Instantly, 24/7" },
              { num: "3", title: "Asks smart questions", desc: "What, when, where" },
              { num: "4", title: "Books or sends lead", desc: "You just show up" },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-blue-200">{step.desc}</p>
                {i < 3 && (
                  <div className="hidden sm:block absolute top-6 left-full w-full h-0.5 bg-blue-700 -translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: PROOF ========== */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            The Math Is Simple
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-50 rounded-xl p-8 text-center border-2 border-slate-200">
              <p className="text-5xl font-bold text-slate-900 mb-2">$299</p>
              <p className="text-slate-600">BookFox per month</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-8 text-center border-2 border-emerald-200">
              <p className="text-5xl font-bold text-emerald-600 mb-2">1</p>
              <p className="text-slate-600">Extra job booked per week pays for itself</p>
            </div>
            <div className="bg-red-50 rounded-xl p-8 text-center border-2 border-red-200">
              <p className="text-5xl font-bold text-red-600 mb-2">$2-5k</p>
              <p className="text-slate-600">Lost monthly from missed calls</p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white rounded-xl p-8 text-center">
            <p className="text-xl mb-2">Just 1 extra booked job per week usually pays for BookFox.</p>
            <p className="text-slate-400">Most contractors book 3–5 extra jobs in the first month.</p>
          </div>
          
          <div className="text-center mt-10">
            <CTAButton>See How It Books Jobs Automatically</CTAButton>
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: WHO IT'S FOR ========== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            Is BookFox Right For You?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Great for */}
            <div className="bg-white rounded-xl p-8 border-2 border-emerald-200">
              <h3 className="font-bold text-xl text-emerald-700 mb-6 flex items-center gap-2">
                <span className="text-2xl">✓</span> Great for:
              </h3>
              <ul className="space-y-4">
                {[
                  "Plumbers",
                  "HVAC contractors",
                  "Electricians",
                  "Roofing companies",
                  "Home service businesses",
                  "Contractors doing $20k+/month",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-slate-700">
                    <span className="text-emerald-500">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Not for */}
            <div className="bg-white rounded-xl p-8 border-2 border-slate-200">
              <h3 className="font-bold text-xl text-slate-500 mb-6 flex items-center gap-2">
                <span className="text-2xl">✕</span> Not for:
              </h3>
              <ul className="space-y-4">
                {[
                  "One-off handyman gigs",
                  "Businesses without steady inbound calls",
                  "Companies that don't want to grow",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg text-slate-500">
                    <span>✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: CTA ========== */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Ready to stop losing jobs?
          </h2>
          <CTAButton>See How It Books Jobs Automatically</CTAButton>
        </div>
      </section>

      {/* ========== SECTION 8: FAQ ========== */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center mb-12">
            Common Questions
          </h2>
          
          <div className="bg-white rounded-xl p-8 border border-slate-200">
            <FAQ 
              q="Will this sound robotic?" 
              a="No. BookFox sounds natural and conversational. Most customers have no idea they're talking to AI. We've tested this with hundreds of calls." 
            />
            <FAQ 
              q="What if it messes up a booking?" 
              a="You review everything. BookFox confirms details before booking, and you get notified instantly. If it's ever unsure, it escalates to you." 
            />
            <FAQ 
              q="Can I customize what it says?" 
              a="Yes. You tell BookFox your services, pricing, availability, and how you want leads qualified. It learns your business." 
            />
            <FAQ 
              q="How fast can I set this up?" 
              a="15 minutes. We do a quick call together, connect your phone number, and you're live the same day." 
            />
            <FAQ 
              q="What does it cost?" 
              a="$299/month after a 14-day free trial. No contracts, cancel anytime. One extra job usually covers 10+ months." 
            />
            <FAQ 
              q="What if I want to cancel?" 
              a="One click. No fees. No hassle. We don't lock you into anything." 
            />
          </div>
        </div>
      </section>

      {/* ========== SECTION 9: FINAL CTA ========== */}
      <section className="py-20 px-6 bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Every Day Without BookFox Is Missed Jobs and Wasted Time
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Your competitors are answering their phones. Are you?
          </p>
          <CTAButton className="bg-emerald-500 hover:bg-emerald-400">
            See How It Books Jobs Automatically
          </CTAButton>
          <p className="text-blue-300 text-sm mt-6">
            Free 14-day trial. No credit card required. Setup in 15 minutes.
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="BookFox" className="w-8 h-8" />
            <span className="font-bold text-slate-800">Book<span className="text-blue-600">Fox</span></span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 BookFox. All rights reserved.</p>
          <div className="flex gap-6 text-slate-500 text-sm">
            <a href="#" className="hover:text-slate-800">Privacy</a>
            <a href="#" className="hover:text-slate-800">Terms</a>
            <a href="mailto:hello@bookfox.ai" className="hover:text-slate-800">Contact</a>
          </div>
        </div>
      </footer>

      {/* ========== STICKY MOBILE CTA ========== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 lg:hidden z-50">
        <Link 
          to="/signup" 
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg py-4 rounded-lg text-center transition active:scale-[0.98]"
        >
          Get Your AI Receptionist Demo
        </Link>
      </div>
      
      {/* Bottom padding for sticky CTA on mobile */}
      <div className="h-20 lg:hidden"></div>
    </div>
  );
}

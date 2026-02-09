import { Link } from 'react-router-dom';
import { useState } from 'react';

// FAQ Accordion
function FAQ({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        onClick={() => setOpen(!open)} 
        className="w-full py-5 flex justify-between items-center text-left gap-4"
      >
        <span className="font-semibold text-slate-800 text-lg">{q}</span>
        <span className={`text-2xl text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="pb-5 text-slate-600 text-lg leading-relaxed">{a}</p>}
    </div>
  );
}

// Main CTA Button - consistent everywhere
function CTAButton({ children, className = '', full = true }) {
  return (
    <Link 
      to="/signup" 
      className={`block bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl px-8 py-5 rounded-xl text-center transition active:scale-[0.98] ${full ? 'w-full' : ''} ${className}`}
    >
      {children}
    </Link>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      
      {/* ==================== */}
      {/* SECTION 1: HERO */}
      {/* ==================== */}
      <section className="min-h-[100svh] flex flex-col justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
            <span className="text-xl font-bold">Book<span className="text-blue-600">Fox</span></span>
          </div>
          
          {/* Headline - short for mobile */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Never Miss Another Job Call Again
          </h1>
          
          {/* Subheadline - one line */}
          <p className="text-lg sm:text-xl text-slate-600 mb-8">
            BookFox answers calls and books jobs for trade businesses — 24/7.
          </p>
          
          {/* CTA - big, full width */}
          <CTAButton>See It In Action</CTAButton>
          
          {/* Micro-trust */}
          <p className="text-slate-400 text-sm text-center mt-4">
            Takes 2 minutes · No obligation
          </p>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 2: PAIN */}
      {/* ==================== */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Missed Calls = Lost Jobs
          </h2>
          
          {/* Bullets - no icons, one line each */}
          <ul className="space-y-4 text-lg text-slate-700">
            <li>• Customers call the next contractor</li>
            <li>• After-hours leads go cold</li>
            <li>• You're stuck answering the phone</li>
            <li>• Hiring help is expensive</li>
          </ul>
          
          <p className="mt-8 text-lg text-slate-600">
            Miss 5 calls a week? That's <span className="font-bold text-red-600">$2,000–5,000/month</span> gone.
          </p>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 3: WHAT BOOKFOX DOES */}
      {/* ==================== */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            What BookFox Does
          </h2>
          
          {/* Stacked cards */}
          <div className="space-y-4">
            {[
              { icon: "📞", title: "Answers Every Call", desc: "Even nights and weekends." },
              { icon: "📅", title: "Books Jobs Automatically", desc: "Sends you confirmed, qualified leads." },
              { icon: "🚫", title: "Filters Bad Calls", desc: "No tire-kickers or spam." },
              { icon: "💰", title: "Costs Less Than Hiring", desc: "No payroll. No sick days." },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{item.title}</h3>
                    <p className="text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10">
            <CTAButton>See It In Action</CTAButton>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 4: HOW IT WORKS */}
      {/* ==================== */}
      <section className="py-16 px-6 bg-blue-900 text-white">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">
            How It Works
          </h2>
          
          {/* Numbered list - no diagrams */}
          <ol className="space-y-6 text-lg">
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold">1</span>
              <span className="pt-2">Customer calls your business</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold">2</span>
              <span className="pt-2">BookFox answers instantly</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold">3</span>
              <span className="pt-2">Asks smart questions</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center font-bold">4</span>
              <span className="pt-2">Books the job or sends you the lead</span>
            </li>
          </ol>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 5: PROOF / ROI */}
      {/* ==================== */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">
            Just 1 Extra Job Per Week Pays for BookFox
          </h2>
          
          <p className="text-lg text-slate-600 mb-6">
            Most trade jobs are worth $200–$1,000+.
          </p>
          
          <p className="text-lg text-slate-600 mb-8">
            Missing just a few calls costs you thousands every month.
          </p>
          
          {/* Simple math box */}
          <div className="bg-slate-900 text-white rounded-xl p-6 text-center">
            <p className="text-slate-400 mb-2">BookFox costs</p>
            <p className="text-4xl font-bold mb-2">$299/month</p>
            <p className="text-emerald-400">One job pays for 3+ months</p>
          </div>
          
          <div className="mt-10">
            <CTAButton>See It In Action</CTAButton>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 6: WHO IT'S FOR */}
      {/* ==================== */}
      <section className="py-16 px-6 bg-slate-50">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Is BookFox Right For You?
          </h2>
          
          {/* Two lists */}
          <div className="space-y-8">
            
            {/* Great for */}
            <div>
              <h3 className="font-bold text-emerald-700 text-lg mb-4">✓ Great for:</h3>
              <ul className="space-y-2 text-lg text-slate-700">
                <li>• Plumbers</li>
                <li>• HVAC</li>
                <li>• Electricians</li>
                <li>• Contractors</li>
              </ul>
            </div>
            
            {/* Not for */}
            <div>
              <h3 className="font-bold text-slate-500 text-lg mb-4">✕ Not for:</h3>
              <ul className="space-y-2 text-lg text-slate-500">
                <li>• One-off handyman gigs</li>
                <li>• Businesses without steady calls</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 7: FAQ */}
      {/* ==================== */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
            Questions
          </h2>
          
          <div className="bg-slate-50 rounded-xl p-6">
            <FAQ 
              q="Does it sound robotic?" 
              a="No. Customers can't tell it's AI. It sounds natural and friendly." 
            />
            <FAQ 
              q="Can I customize it?" 
              a="Yes. Tell it your services, hours, and how to handle calls." 
            />
            <FAQ 
              q="What if it makes a mistake?" 
              a="It confirms details before booking. If unsure, it sends you the lead." 
            />
            <FAQ 
              q="How fast can I start?" 
              a="15 minutes. We set it up together. Live same day." 
            />
            <FAQ 
              q="What's the cost?" 
              a="$299/month after a 14-day free trial. Cancel anytime." 
            />
          </div>
        </div>
      </section>

      {/* ==================== */}
      {/* SECTION 8: FINAL CTA */}
      {/* ==================== */}
      <section className="py-16 px-6 bg-blue-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Every Missed Call Is a Lost Job
          </h2>
          
          <p className="text-lg text-blue-200 mb-8">
            Your competitors answer their phones. Do you?
          </p>
          
          <CTAButton className="bg-emerald-500 hover:bg-emerald-400">
            See It In Action
          </CTAButton>
          
          <p className="text-blue-300 text-sm mt-4">
            Free trial · No credit card · 15 min setup
          </p>
        </div>
      </section>

      {/* ==================== */}
      {/* FOOTER */}
      {/* ==================== */}
      <footer className="py-8 px-6 border-t border-slate-200">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/logo.png" alt="BookFox" className="w-8 h-8" />
            <span className="font-bold">Book<span className="text-blue-600">Fox</span></span>
          </div>
          <p className="text-slate-400 text-sm mb-2">© 2026 BookFox</p>
          <div className="flex justify-center gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-600">Privacy</a>
            <a href="#" className="hover:text-slate-600">Terms</a>
          </div>
        </div>
      </footer>

      {/* ==================== */}
      {/* STICKY MOBILE CTA */}
      {/* ==================== */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 z-50 lg:hidden">
        <Link 
          to="/signup" 
          className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl py-4 rounded-xl text-center transition active:scale-[0.98]"
        >
          Get Demo
        </Link>
      </div>
      
      {/* Spacer for sticky CTA */}
      <div className="h-24 lg:hidden"></div>
    </div>
  );
}

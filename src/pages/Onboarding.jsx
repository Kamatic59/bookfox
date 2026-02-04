import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Premium step indicator with animation
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`relative flex items-center justify-center transition-all duration-500 ${
              i <= currentStep
                ? 'scale-100'
                : 'scale-90 opacity-50'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-500 ${
                i < currentStep
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : i === currentStep
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              {i < currentStep ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-12 h-1 mx-2 rounded-full transition-all duration-500 ${
              i < currentStep ? 'bg-emerald-400' : 'bg-stone-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Business name step - only shown if no business exists
function BusinessNameStep({ value, onChange }) {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Let's get started
        </span>
        <h2 className="text-3xl font-bold text-stone-800 mb-3">What's your business called?</h2>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          This is how customers will see your business
        </p>
      </div>
      
      <div className="max-w-lg mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Smith's Plumbing"
            className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
            autoFocus
          />
        </div>
        <p className="text-stone-500 text-sm mt-3">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}

// Trade type selection - premium cards
function TradeTypeStep({ value, onChange }) {
  const trades = [
    { id: 'plumber', icon: '🔧', label: 'Plumbing', desc: 'Pipes, fixtures, drains' },
    { id: 'hvac', icon: '❄️', label: 'HVAC', desc: 'Heating & cooling' },
    { id: 'electrician', icon: '⚡', label: 'Electrical', desc: 'Wiring & repairs' },
    { id: 'roofer', icon: '🏠', label: 'Roofing', desc: 'Shingles & repairs' },
    { id: 'landscaper', icon: '🌿', label: 'Landscaping', desc: 'Lawns & gardens' },
    { id: 'handyman', icon: '🛠️', label: 'Handyman', desc: 'General repairs' },
    { id: 'painter', icon: '🎨', label: 'Painting', desc: 'Interior & exterior' },
    { id: 'other', icon: '📦', label: 'Other', desc: 'Something else' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 1 of 4
        </span>
        <h2 className="text-3xl font-bold text-stone-800 mb-3">What's your trade?</h2>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          We'll customize your AI assistant to speak your customers' language
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trades.map((trade) => (
          <button
            key={trade.id}
            onClick={() => onChange(trade.id)}
            className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 ${
              value === trade.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20'
                : 'border-stone-200 hover:border-blue-300 hover:shadow-lg bg-white'
            }`}
          >
            <div className={`text-4xl mb-3 transition-transform duration-300 ${
              value === trade.id ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              {trade.icon}
            </div>
            <div className={`font-semibold mb-1 transition-colors ${
              value === trade.id ? 'text-blue-700' : 'text-stone-700'
            }`}>
              {trade.label}
            </div>
            <div className="text-xs text-stone-500">{trade.desc}</div>
            {value === trade.id && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Business hours - mobile optimized
function HoursStep({ value, onChange }) {
  const days = [
    { id: 'monday', label: 'Monday', short: 'Mon' },
    { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { id: 'thursday', label: 'Thursday', short: 'Thu' },
    { id: 'friday', label: 'Friday', short: 'Fri' },
    { id: 'saturday', label: 'Saturday', short: 'Sat' },
    { id: 'sunday', label: 'Sunday', short: 'Sun' },
  ];

  const toggleDay = (dayId) => {
    const newValue = { ...value };
    if (newValue[dayId]) {
      newValue[dayId] = { ...newValue[dayId], enabled: !newValue[dayId].enabled };
    } else {
      newValue[dayId] = { enabled: true, start: '08:00', end: '17:00' };
    }
    onChange(newValue);
  };

  const updateTime = (dayId, field, time) => {
    const newValue = { ...value };
    if (!newValue[dayId]) {
      newValue[dayId] = { enabled: true, start: '08:00', end: '17:00' };
    }
    newValue[dayId][field] = time;
    onChange(newValue);
  };

  const setQuickHours = (type) => {
    const newValue = {};
    days.forEach(day => {
      if (type === 'weekdays') {
        newValue[day.id] = {
          enabled: !['saturday', 'sunday'].includes(day.id),
          start: '08:00',
          end: '17:00'
        };
      } else if (type === 'allweek') {
        newValue[day.id] = { enabled: true, start: '08:00', end: '18:00' };
      } else if (type === 'custom') {
        newValue[day.id] = value[day.id] || { enabled: false, start: '08:00', end: '17:00' };
      }
    });
    onChange(newValue);
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 2 of 4
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2 md:mb-3">Your business hours</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
          So BookFox knows when to catch your calls
        </p>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 md:gap-3 justify-center mb-6 md:mb-8">
        <button
          onClick={() => setQuickHours('weekdays')}
          className="px-3 md:px-4 py-2 rounded-full bg-stone-100 hover:bg-blue-100 hover:text-blue-700 text-stone-600 text-sm font-medium transition-all active:scale-95"
        >
          Mon-Fri
        </button>
        <button
          onClick={() => setQuickHours('allweek')}
          className="px-3 md:px-4 py-2 rounded-full bg-stone-100 hover:bg-blue-100 hover:text-blue-700 text-stone-600 text-sm font-medium transition-all active:scale-95"
        >
          7 Days
        </button>
      </div>
      
      <div className="space-y-2 md:space-y-3 max-w-lg mx-auto">
        {days.map((day) => {
          const dayData = value[day.id] || { enabled: !['saturday', 'sunday'].includes(day.id), start: '08:00', end: '17:00' };
          
          return (
            <div
              key={day.id}
              className={`p-3 md:p-4 rounded-xl border-2 transition-all duration-300 ${
                dayData.enabled 
                  ? 'border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80' 
                  : 'border-stone-200 bg-stone-50/50'
              }`}
            >
              {/* Day toggle row */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleDay(day.id)}
                  className="flex items-center gap-3 flex-1 min-h-[44px]"
                >
                  <div
                    className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                      dayData.enabled
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'border-stone-300'
                    }`}
                  >
                    {dayData.enabled && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium ${dayData.enabled ? 'text-stone-800' : 'text-stone-400'}`}>
                    <span className="md:hidden">{day.short}</span>
                    <span className="hidden md:inline">{day.label}</span>
                  </span>
                </button>
                
                {!dayData.enabled && (
                  <span className="text-stone-400 text-sm">Closed</span>
                )}
              </div>
              
              {/* Time inputs - stacked on mobile */}
              {dayData.enabled && (
                <div className="flex items-center gap-2 mt-3 pl-10">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => updateTime(day.id, 'start', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <span className="text-stone-400 text-sm flex-shrink-0">to</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => updateTime(day.id, 'end', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2.5 border border-stone-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Phone setup - cleaner info card
function PhoneStep({ value, onChange }) {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 3 of 4
        </span>
        <h2 className="text-3xl font-bold text-stone-800 mb-3">Connect your phone</h2>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          We'll give you a dedicated BookFox number
        </p>
      </div>
      
      {/* How it works card */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white max-w-lg mx-auto shadow-xl shadow-blue-500/30">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">How it works</h3>
            <p className="text-white/90 text-sm leading-relaxed">
              Forward your business calls to your BookFox number. We'll catch any calls you miss 
              and follow up automatically via SMS with AI-powered responses.
            </p>
          </div>
        </div>
      </div>

      {/* Phone input */}
      <div className="max-w-lg mx-auto">
        <label className="block text-sm font-semibold text-stone-700 mb-3">
          Your Business Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="(385) 555-0100"
            className="w-full pl-12 pr-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
          />
        </div>
        <p className="text-stone-500 text-sm mt-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          We'll show you how to set up call forwarding after setup
        </p>
      </div>
    </div>
  );
}

// AI settings - premium preview
function AiStep({ value, onChange, businessName }) {
  const [typing, setTyping] = useState(false);
  
  useEffect(() => {
    setTyping(true);
    const timer = setTimeout(() => setTyping(false), 500);
    return () => clearTimeout(timer);
  }, [value.name]);

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 4 of 4
        </span>
        <h2 className="text-3xl font-bold text-stone-800 mb-3">Name your AI assistant</h2>
        <p className="text-stone-500 text-lg max-w-md mx-auto">
          Give it a personality that matches your brand
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-8">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">
            Assistant Name
          </label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="BookFox"
            className="w-full px-4 py-4 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg"
          />
        </div>

        {/* Message preview */}
        <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl p-6 border border-stone-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Live Preview</span>
            {typing && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
          </div>
          
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
              <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm flex-1">
              <p className="text-stone-700 leading-relaxed">
                Hi! This is <span className="font-semibold text-blue-600">{value.name || 'BookFox'}</span> from {businessName || 'your business'}. 
                I noticed we missed your call. How can I help you today? 🦊
              </p>
              <span className="text-xs text-stone-400 mt-2 block">Just now</span>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div>
          <p className="text-sm text-stone-500 mb-2">Popular names:</p>
          <div className="flex flex-wrap gap-2">
            {['BookFox', 'Alex', 'Sam', 'Jamie', 'Casey'].map((name) => (
              <button
                key={name}
                onClick={() => onChange({ ...value, name })}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  value.name === name
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-stone-100 text-stone-600 hover:bg-blue-100 hover:text-blue-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Success step - celebration
function SuccessStep({ businessName }) {
  return (
    <div className="text-center animate-fadeIn">
      {/* Celebration animation */}
      <div className="relative mb-8">
        <div className="text-8xl animate-bounce">🎉</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-blue-500/10 rounded-full animate-ping" />
        </div>
      </div>
      
      <h2 className="text-4xl font-bold text-stone-800 mb-4">You're all set!</h2>
      <p className="text-stone-600 text-xl mb-10 max-w-md mx-auto">
        BookFox is ready to catch leads for <span className="font-semibold">{businessName}</span>
      </p>
      
      {/* What's next card */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-8 text-left max-w-md mx-auto">
        <h4 className="font-bold text-emerald-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          Next steps
        </h4>
        <ul className="space-y-4">
          {[
            'Set up call forwarding from your business phone',
            'Test by calling your new BookFox number',
            'Watch the leads roll in! 🚀'
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-emerald-700">
              <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const { user, business, refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [direction, setDirection] = useState(1);
  const [businessName, setBusinessName] = useState('');
  
  // Form state
  const [tradeType, setTradeType] = useState('');
  const [hours, setHours] = useState({
    monday: { enabled: true, start: '08:00', end: '17:00' },
    tuesday: { enabled: true, start: '08:00', end: '17:00' },
    wednesday: { enabled: true, start: '08:00', end: '17:00' },
    thursday: { enabled: true, start: '08:00', end: '17:00' },
    friday: { enabled: true, start: '08:00', end: '17:00' },
    saturday: { enabled: false, start: '09:00', end: '14:00' },
    sunday: { enabled: false, start: null, end: null },
  });
  const [phone, setPhone] = useState('');
  const [aiSettings, setAiSettings] = useState({ name: 'BookFox' });

  // If no business exists, we need to collect business name first
  const needsBusinessCreation = !business;
  const totalSteps = needsBusinessCreation ? 6 : 5;
  
  // Adjust step indices based on whether we need business creation
  const getActualStep = () => {
    if (needsBusinessCreation) return step;
    return step + 1; // Skip business name step
  };

  const canContinue = () => {
    const actualStep = getActualStep();
    switch (actualStep) {
      case 0: return businessName.trim().length >= 2; // Business name
      case 1: return !!tradeType;
      case 2: return true;
      case 3: return true;
      case 4: return !!aiSettings.name;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = async () => {
    setError(null);
    
    if (step < totalSteps - 1) {
      setDirection(1);
      setStep(step + 1);
    } else {
      // Save all settings and go to dashboard
      setLoading(true);
      try {
        let currentBusiness = business;
        
        // Create business if it doesn't exist
        if (!currentBusiness && user) {
          const { data: newBusiness, error: bizError } = await supabase
            .from('businesses')
            .insert({ name: businessName.trim() })
            .select()
            .single();

          if (bizError) throw bizError;

          // Create team member link
          const { error: teamError } = await supabase
            .from('team_members')
            .insert({
              user_id: user.id,
              business_id: newBusiness.id,
              role: 'owner',
            });

          if (teamError) throw teamError;
          
          // Create default AI settings
          await supabase
            .from('ai_settings')
            .insert({
              business_id: newBusiness.id,
              assistant_name: aiSettings.name || 'BookFox',
            });

          currentBusiness = newBusiness;
        }
        
        if (currentBusiness) {
          // Update business
          await supabase
            .from('businesses')
            .update({
              trade_type: tradeType,
              business_hours: hours,
              phone: phone,
            })
            .eq('id', currentBusiness.id);

          // Update AI settings
          await supabase
            .from('ai_settings')
            .update({
              assistant_name: aiSettings.name,
            })
            .eq('business_id', currentBusiness.id);
        }

        await refreshBusiness();
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to save onboarding:', err);
        setError(err.message || 'Failed to save. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3">
              <img src="/logo.png" alt="BookFox" className="w-14 h-14" />
              <span className="text-3xl font-bold text-stone-800">
                Book<span className="text-blue-600">Fox</span>
              </span>
            </div>
          </div>

          {/* Progress */}
          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-stone-900/10 p-8 md:p-12 border border-white/50">
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[400px]">
              {needsBusinessCreation ? (
                <>
                  {step === 0 && <BusinessNameStep value={businessName} onChange={setBusinessName} />}
                  {step === 1 && <TradeTypeStep value={tradeType} onChange={setTradeType} />}
                  {step === 2 && <HoursStep value={hours} onChange={setHours} />}
                  {step === 3 && <PhoneStep value={phone} onChange={setPhone} />}
                  {step === 4 && <AiStep value={aiSettings} onChange={setAiSettings} businessName={businessName} />}
                  {step === 5 && <SuccessStep businessName={businessName} />}
                </>
              ) : (
                <>
                  {step === 0 && <TradeTypeStep value={tradeType} onChange={setTradeType} />}
                  {step === 1 && <HoursStep value={hours} onChange={setHours} />}
                  {step === 2 && <PhoneStep value={phone} onChange={setPhone} />}
                  {step === 3 && <AiStep value={aiSettings} onChange={setAiSettings} businessName={business?.name} />}
                  {step === 4 && <SuccessStep businessName={business?.name} />}
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100">
              {step > 0 && step < totalSteps - 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-stone-600 font-medium hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={handleNext}
                disabled={!canContinue() || loading}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Saving...
                  </>
                ) : step === totalSteps - 1 ? (
                  <>
                    Go to Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Skip option */}
          {step < totalSteps - 1 && (
            <p className="text-center mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-stone-400 hover:text-stone-600 text-sm transition-colors"
              >
                Skip for now
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

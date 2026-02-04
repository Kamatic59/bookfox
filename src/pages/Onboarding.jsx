import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Step indicator
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[...Array(totalSteps)].map((_, i) => (
        <div
          key={i}
          className={`h-2 rounded-full transition-all ${
            i < currentStep
              ? 'bg-blue-600 w-8'
              : i === currentStep
              ? 'bg-blue-600 w-8'
              : 'bg-stone-200 w-2'
          }`}
        />
      ))}
    </div>
  );
}

// Trade type selection
function TradeTypeStep({ value, onChange }) {
  const trades = [
    { id: 'plumber', icon: '🔧', label: 'Plumbing' },
    { id: 'hvac', icon: '❄️', label: 'HVAC' },
    { id: 'electrician', icon: '⚡', label: 'Electrical' },
    { id: 'roofer', icon: '🏠', label: 'Roofing' },
    { id: 'landscaper', icon: '🌿', label: 'Landscaping' },
    { id: 'handyman', icon: '🛠️', label: 'Handyman' },
    { id: 'painter', icon: '🎨', label: 'Painting' },
    { id: 'other', icon: '📦', label: 'Other' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">What type of trade are you in?</h2>
      <p className="text-stone-500 mb-8">This helps us customize your AI assistant's responses</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trades.map((trade) => (
          <button
            key={trade.id}
            onClick={() => onChange(trade.id)}
            className={`p-6 rounded-2xl border-2 transition-all ${
              value === trade.id
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/10'
                : 'border-stone-200 hover:border-blue-200 hover:bg-stone-50'
            }`}
          >
            <span className="text-4xl block mb-3">{trade.icon}</span>
            <span className={`font-medium ${value === trade.id ? 'text-blue-700' : 'text-stone-700'}`}>
              {trade.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// Business hours step
function HoursStep({ value, onChange }) {
  const days = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' },
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">What are your business hours?</h2>
      <p className="text-stone-500 mb-8">BookFox will know when to expect your calls</p>
      
      <div className="space-y-3">
        {days.map((day) => {
          const dayData = value[day.id] || { enabled: day.id !== 'sunday' && day.id !== 'saturday', start: '08:00', end: '17:00' };
          
          return (
            <div
              key={day.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                dayData.enabled ? 'border-blue-200 bg-blue-50/50' : 'border-stone-200'
              }`}
            >
              <button
                onClick={() => toggleDay(day.id)}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  dayData.enabled
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-stone-300'
                }`}
              >
                {dayData.enabled && (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              
              <span className={`w-28 font-medium ${dayData.enabled ? 'text-stone-800' : 'text-stone-400'}`}>
                {day.label}
              </span>
              
              {dayData.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => updateTime(day.id, 'start', e.target.value)}
                    className="px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                  <span className="text-stone-400">to</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => updateTime(day.id, 'end', e.target.value)}
                    className="px-3 py-2 border border-stone-300 rounded-lg bg-white"
                  />
                </div>
              ) : (
                <span className="text-stone-400 text-sm">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Phone setup step
function PhoneStep({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Set up your phone number</h2>
      <p className="text-stone-500 mb-8">We'll give you a dedicated number for BookFox</p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">📱</span>
          <div>
            <h3 className="font-bold text-stone-800 mb-1">How it works</h3>
            <p className="text-stone-600 text-sm leading-relaxed">
              You'll get a dedicated BookFox phone number. Forward your business calls to this number, 
              and BookFox will catch any calls you miss and follow up automatically via SMS.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Your Business Phone Number
          </label>
          <input
            type="tel"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="(385) 555-0100"
            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <p className="text-stone-500 text-xs mt-2">
            We'll show you how to forward calls from this number after setup
          </p>
        </div>
      </div>
    </div>
  );
}

// AI settings step
function AiStep({ value, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Customize your AI assistant</h2>
      <p className="text-stone-500 mb-8">Give your assistant a personality that matches your brand</p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Assistant Name
          </label>
          <input
            type="text"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="BookFox"
            className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
          <p className="text-stone-500 text-xs mt-2">
            The name your AI will use when greeting customers
          </p>
        </div>

        <div className="bg-stone-50 rounded-2xl p-6">
          <h4 className="font-medium text-stone-800 mb-4">Preview</h4>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-lg flex-shrink-0">
              🦊
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm">
              <p className="text-stone-700">
                Hi! This is {value.name || 'BookFox'} from your business. 
                I noticed we missed your call. How can I help you today? 🦊
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Success step
function SuccessStep({ businessName }) {
  return (
    <div className="text-center">
      <div className="text-8xl mb-6">🎉</div>
      <h2 className="text-3xl font-bold text-stone-800 mb-4">You're all set!</h2>
      <p className="text-stone-600 text-lg mb-8 max-w-md mx-auto">
        BookFox is ready to catch missed calls for {businessName}. 
        Let's take a look at your new dashboard!
      </p>
      
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 mb-8 text-left max-w-md mx-auto">
        <h4 className="font-bold text-emerald-800 mb-3">✅ What's next?</h4>
        <ul className="space-y-2 text-emerald-700">
          <li className="flex items-center gap-2">
            <span>1.</span> Forward calls from your business phone
          </li>
          <li className="flex items-center gap-2">
            <span>2.</span> Test by calling your BookFox number
          </li>
          <li className="flex items-center gap-2">
            <span>3.</span> Watch the leads roll in!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function Onboarding() {
  const { business, refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  
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

  const totalSteps = 5;

  const canContinue = () => {
    switch (step) {
      case 0: return !!tradeType;
      case 1: return true;
      case 2: return true;
      case 3: return !!aiSettings.name;
      case 4: return true;
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save all settings and go to dashboard
      setLoading(true);
      try {
        // Update business
        await supabase
          .from('businesses')
          .update({
            trade_type: tradeType,
            business_hours: hours,
            phone: phone,
          })
          .eq('id', business.id);

        // Update AI settings
        await supabase
          .from('ai_settings')
          .update({
            assistant_name: aiSettings.name,
          })
          .eq('business_id', business.id);

        await refreshBusiness();
        navigate('/dashboard');
      } catch (error) {
        console.error('Failed to save onboarding:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/30 to-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-stone-800">
            <span className="text-4xl">🦊</span>
            <span>BookFox</span>
          </div>
        </div>

        {/* Progress */}
        <StepIndicator currentStep={step} totalSteps={totalSteps} />

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Step Content */}
          {step === 0 && <TradeTypeStep value={tradeType} onChange={setTradeType} />}
          {step === 1 && <HoursStep value={hours} onChange={setHours} />}
          {step === 2 && <PhoneStep value={phone} onChange={setPhone} />}
          {step === 3 && <AiStep value={aiSettings} onChange={setAiSettings} />}
          {step === 4 && <SuccessStep businessName={business?.name} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-stone-100">
            {step > 0 && step < 4 ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 text-stone-600 font-medium hover:text-stone-800 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}
            
            <button
              onClick={handleNext}
              disabled={!canContinue() || loading}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : step === 4 ? (
                'Go to Dashboard →'
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </div>

        {/* Skip */}
        {step < 4 && (
          <p className="text-center mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-stone-500 hover:text-stone-700 text-sm"
            >
              Skip for now, I'll set this up later
            </button>
          </p>
        )}
      </div>
    </div>
  );
}

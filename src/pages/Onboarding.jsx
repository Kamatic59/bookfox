import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Progress bar
function Progress({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      <div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-500" 
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <span className="text-sm text-stone-500 font-medium">Step {step} of {total}</span>
    </div>
  );
}

export default function Onboarding() {
  const { user, business, refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get first name from signup
  const firstName = localStorage.getItem('bookfox_firstName') || 'there';

  // Form data
  const [data, setData] = useState({
    companyName: '',
    serviceType: '',
    serviceArea: '',
    phone: '',
    useExistingPhone: true,
    leadSources: [],
    responseTime: 'same_day',
    freeEstimates: 'yes',
    priceMin: 500,
    priceMax: 10000,
    emergencyService: 'business_hours',
    schedule: {
      monday: { open: '09:00', close: '17:00', enabled: true },
      tuesday: { open: '09:00', close: '17:00', enabled: true },
      wednesday: { open: '09:00', close: '17:00', enabled: true },
      thursday: { open: '09:00', close: '17:00', enabled: true },
      friday: { open: '09:00', close: '17:00', enabled: true },
      saturday: { open: '09:00', close: '17:00', enabled: false },
      sunday: { open: '09:00', close: '17:00', enabled: false },
    },
    appointmentDuration: 60,
    bufferTime: 30,
  });

  const update = (key, value) => setData(d => ({ ...d, [key]: value }));
  const totalSteps = 7;

  const next = () => {
    setError(null);
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };
  const back = () => step > 0 && setStep(step - 1);

  // Final save
  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      // Create or update business via Edge Function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-business`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: data.companyName,
            trade_type: data.serviceType,
            business_hours: data.schedule,
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        console.error('Edge Function error:', response.status, result);
        throw new Error(result.details || result.error || `Failed to save (${response.status})`);
      }

      await refreshBusiness();
      localStorage.removeItem('bookfox_firstName');
      navigate('/dashboard');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 0: Welcome
  if (step === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <img src="/logo.png" alt="BookFox" className="w-14 h-14" />
          </div>
          <h1 className="text-3xl font-bold text-stone-800 mb-3">Welcome to BookFox, {firstName}!</h1>
          <p className="text-stone-600 mb-8">
            We're going to get you set up in about 10 minutes. Here's what we'll do:
          </p>
          <div className="space-y-3 text-left mb-8">
            {[
              { icon: '🔗', text: 'Connect your lead sources', time: '3 min' },
              { icon: '💼', text: 'Teach BookFox about your business', time: '5 min' },
              { icon: '✅', text: 'See it respond to a test lead', time: '2 min' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-stone-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-stone-700 font-medium">{item.text}</span>
                </div>
                <span className="text-stone-400 text-sm">{item.time}</span>
              </div>
            ))}
          </div>
          <button
            onClick={next}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition"
          >
            Let's Get Started
          </button>
        </div>
      </div>
    );
  }

  // STEP 1: Business Basics
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={1} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Tell Us About Your Business</h2>
          <p className="text-stone-500 mb-8">Just the basics — takes 60 seconds.</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Company Name</label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => update('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Acme Plumbing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">What service do you provide?</label>
              <select
                value={data.serviceType}
                onChange={(e) => update('serviceType', e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Select a service...</option>
                <option value="hvac">HVAC</option>
                <option value="roofing">Roofing</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="solar">Solar Installation</option>
                <option value="general">General Contracting</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">What area do you serve?</label>
              <input
                type="text"
                value={data.serviceArea}
                onChange={(e) => update('serviceArea', e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Salt Lake County"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button
              onClick={next}
              disabled={!data.companyName || !data.serviceType}
              className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: Phone Number
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={2} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Your Business Phone Number</h2>
          <p className="text-stone-500 mb-8">BookFox will text leads from this number.</p>

          <div className="space-y-4 mb-6">
            <label 
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                data.useExistingPhone ? 'border-blue-500 bg-blue-50' : 'border-stone-200 hover:border-stone-300'
              }`}
              onClick={() => update('useExistingPhone', true)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                data.useExistingPhone ? 'border-blue-500' : 'border-stone-300'
              }`}>
                {data.useExistingPhone && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
              </div>
              <div>
                <p className="font-medium text-stone-800">Use my existing number</p>
                <p className="text-sm text-stone-500">Free — works with your current business line</p>
              </div>
            </label>

            <label 
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                !data.useExistingPhone ? 'border-blue-500 bg-blue-50' : 'border-stone-200 hover:border-stone-300'
              }`}
              onClick={() => update('useExistingPhone', false)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                !data.useExistingPhone ? 'border-blue-500' : 'border-stone-300'
              }`}>
                {!data.useExistingPhone && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
              </div>
              <div>
                <p className="font-medium text-stone-800">Get a new local number from BookFox</p>
                <p className="text-sm text-stone-500">+$15/month — separate line for leads</p>
              </div>
            </label>
          </div>

          {data.useExistingPhone && (
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Your Phone Number</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="(555) 123-4567"
              />
            </div>
          )}

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button onClick={next} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 3: Lead Sources
  if (step === 3) {
    const sources = [
      { id: 'website', label: 'Website contact form', icon: '🌐' },
      { id: 'facebook', label: 'Facebook/Instagram messages', icon: '📘' },
      { id: 'google', label: 'Google Business messages', icon: '🔍' },
      { id: 'missed_calls', label: 'Missed phone calls', icon: '📞' },
      { id: 'email', label: 'Email leads', icon: '📧' },
      { id: 'yelp', label: 'Yelp messages', icon: '⭐' },
      { id: 'homeadvisor', label: 'HomeAdvisor/Angi', icon: '🏠' },
    ];

    const toggle = (id) => {
      const current = data.leadSources;
      if (current.includes(id)) {
        update('leadSources', current.filter(s => s !== id));
      } else {
        update('leadSources', [...current, id]);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={3} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Where Do Your Leads Come From?</h2>
          <p className="text-stone-500 mb-6">Check all that apply. We'll help you connect them.</p>

          <div className="space-y-2">
            {sources.map(s => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition ${
                  data.leadSources.includes(s.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="font-medium text-stone-700 flex-1">{s.label}</span>
                {data.leadSources.includes(s.id) && (
                  <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">✓</span>
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button onClick={next} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Next
            </button>
          </div>

          <button onClick={next} className="w-full text-stone-400 text-sm mt-4 hover:text-stone-600">
            I'll do this later
          </button>
        </div>
      </div>
    );
  }

  // STEP 4: Business Questions
  if (step === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={4} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">How Should BookFox Talk To Leads?</h2>
          <p className="text-stone-500 mb-6">Quick questions so BookFox knows what to say.</p>

          <div className="space-y-6">
            {/* Response Time */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Typical response time for quotes?</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'same_day', label: 'Same day' },
                  { value: '24_hours', label: 'Within 24 hours' },
                  { value: '2_3_days', label: '2-3 days' },
                  { value: 'depends', label: 'Depends' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('responseTime', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                      data.responseTime === o.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Free Estimates */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Free estimates?</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'yes', label: 'Yes, always' },
                  { value: 'sometimes', label: 'Sometimes' },
                  { value: 'no', label: 'No' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('freeEstimates', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition ${
                      data.freeEstimates === o.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Emergency Service */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Emergency service available?</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: '24_7', label: 'Yes, 24/7 emergency service' },
                  { value: 'business_hours', label: 'Yes, during business hours only' },
                  { value: 'no', label: 'No, appointments only' },
                ].map(o => (
                  <button
                    key={o.value}
                    onClick={() => update('emergencyService', o.value)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition ${
                      data.emergencyService === o.value 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button onClick={next} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 5: Availability
  if (step === 5) {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayLabels = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

    const toggleDay = (day) => {
      const newSchedule = { ...data.schedule };
      newSchedule[day].enabled = !newSchedule[day].enabled;
      update('schedule', newSchedule);
    };

    const copyToAll = () => {
      const mon = data.schedule.monday;
      const newSchedule = { ...data.schedule };
      days.forEach(d => {
        if (d !== 'saturday' && d !== 'sunday') {
          newSchedule[d] = { ...mon };
        }
      });
      update('schedule', newSchedule);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={5} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">When Can You Take Jobs?</h2>
          <p className="text-stone-500 mb-6">BookFox will only book during these times.</p>

          <div className="space-y-2 mb-6">
            {days.map(day => (
              <div 
                key={day}
                className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                  data.schedule[day].enabled ? 'border-blue-200 bg-blue-50' : 'border-stone-200 bg-stone-50'
                }`}
              >
                <button
                  onClick={() => toggleDay(day)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition ${
                    data.schedule[day].enabled ? 'bg-blue-500 border-blue-500 text-white' : 'border-stone-300'
                  }`}
                >
                  {data.schedule[day].enabled && '✓'}
                </button>
                <span className="w-10 font-medium text-stone-700">{dayLabels[day]}</span>
                {data.schedule[day].enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={data.schedule[day].open}
                      onChange={(e) => {
                        const newSchedule = { ...data.schedule };
                        newSchedule[day].open = e.target.value;
                        update('schedule', newSchedule);
                      }}
                      className="px-2 py-1 border border-stone-300 rounded-lg text-sm"
                    />
                    <span className="text-stone-400">to</span>
                    <input
                      type="time"
                      value={data.schedule[day].close}
                      onChange={(e) => {
                        const newSchedule = { ...data.schedule };
                        newSchedule[day].close = e.target.value;
                        update('schedule', newSchedule);
                      }}
                      className="px-2 py-1 border border-stone-300 rounded-lg text-sm"
                    />
                  </div>
                ) : (
                  <span className="text-stone-400 text-sm">Closed</span>
                )}
              </div>
            ))}
          </div>

          <button onClick={copyToAll} className="text-blue-600 text-sm font-medium mb-6 hover:underline">
            Copy Monday to all weekdays
          </button>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Appointment length</label>
              <select
                value={data.appointmentDuration}
                onChange={(e) => update('appointmentDuration', Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
              >
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">Buffer between</label>
              <select
                value={data.bufferTime}
                onChange={(e) => update('bufferTime', Number(e.target.value))}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm"
              >
                <option value={0}>None</option>
                <option value={15}>15 min</option>
                <option value={30}>30 min</option>
                <option value={60}>1 hour</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button onClick={next} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 6: Test & Finish
  if (step === 6) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="max-w-lg mx-auto pt-8">
          <Progress step={6} total={6} />
          <h2 className="text-2xl font-bold text-stone-800 mb-2">You're All Set! Let's Test It.</h2>
          <p className="text-stone-500 mb-6">Here's how BookFox will respond to leads:</p>

          {/* Conversation Preview */}
          <div className="bg-stone-100 rounded-2xl p-4 mb-6">
            <p className="text-xs text-stone-500 text-center mb-3">Sample Conversation</p>
            <div className="space-y-3">
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"Hey, my AC isn't working"</p>
              </div>
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Hi! I can help with that. I'm with {data.companyName || 'your company'}. Is this an emergency or can it wait until tomorrow?</p>
              </div>
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"Pretty urgent, it's really hot"</p>
              </div>
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Got it. I have availability today at 2pm or 4pm. Which works better?</p>
              </div>
              <div className="bg-stone-200 rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
                <p className="text-sm">"2pm works"</p>
              </div>
              <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] ml-auto">
                <p className="text-sm">Perfect! You're booked for 2pm. I'll send a reminder. See you then! 🙂</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">✅</span>
              <div>
                <p className="font-semibold text-emerald-800">Your customers won't know it's AI</p>
                <p className="text-sm text-emerald-700">Natural language • Books appointments • Works 24/7</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={back} className="px-6 py-3 text-stone-600 font-medium hover:bg-stone-100 rounded-xl transition">Back</button>
            <button
              onClick={finish}
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Go To Dashboard'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

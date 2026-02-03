import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ChevronRight, ChevronLeft, Check, Phone, Clock, Wrench, Sparkles } from 'lucide-react';

const TRADE_TYPES = [
  { id: 'plumber', label: 'Plumbing', icon: '🔧' },
  { id: 'hvac', label: 'HVAC', icon: '❄️' },
  { id: 'electrician', label: 'Electrical', icon: '⚡' },
  { id: 'roofing', label: 'Roofing', icon: '🏠' },
  { id: 'landscaping', label: 'Landscaping', icon: '🌳' },
  { id: 'general', label: 'General Contractor', icon: '🔨' },
  { id: 'other', label: 'Other', icon: '🛠️' },
];

const STEPS = [
  { id: 'trade', title: 'Your Trade', icon: Wrench },
  { id: 'hours', title: 'Business Hours', icon: Clock },
  { id: 'phone', title: 'Phone Setup', icon: Phone },
  { id: 'ai', title: 'AI Settings', icon: Sparkles },
];

export default function Onboarding() {
  const { business, refreshBusiness } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [tradeType, setTradeType] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessHours, setBusinessHours] = useState({
    monday: { start: '08:00', end: '17:00', enabled: true },
    tuesday: { start: '08:00', end: '17:00', enabled: true },
    wednesday: { start: '08:00', end: '17:00', enabled: true },
    thursday: { start: '08:00', end: '17:00', enabled: true },
    friday: { start: '08:00', end: '17:00', enabled: true },
    saturday: { start: '09:00', end: '14:00', enabled: false },
    sunday: { start: '09:00', end: '14:00', enabled: false },
  });
  const [assistantName, setAssistantName] = useState('BookFox');
  const [services, setServices] = useState('');

  async function handleFinish() {
    setLoading(true);
    setError('');

    try {
      // Update business
      const { error: bizError } = await supabase
        .from('businesses')
        .update({
          trade_type: tradeType,
          phone: businessPhone,
          business_hours: businessHours,
        })
        .eq('id', business.id);

      if (bizError) throw bizError;

      // Update AI settings
      const { error: aiError } = await supabase
        .from('ai_settings')
        .update({
          assistant_name: assistantName,
          services_offered: services.split(',').map(s => s.trim()).filter(Boolean),
        })
        .eq('business_id', business.id);

      if (aiError) throw aiError;

      await refreshBusiness();
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  }

  function nextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-stone-800">
            <span className="text-3xl">🦊</span>
            <span>BookFox</span>
          </div>
          <h1 className="text-xl text-stone-700 mt-2">Let's set up your AI receptionist</h1>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-8 px-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-1 ${
                    index < currentStep ? 'bg-green-500' : 'bg-stone-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Trade Type */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">What type of work do you do?</h2>
              <p className="text-stone-600 mb-6">This helps us customize the AI for your industry.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TRADE_TYPES.map((trade) => (
                  <button
                    key={trade.id}
                    type="button"
                    onClick={() => setTradeType(trade.id)}
                    className={`p-4 rounded-xl border-2 text-left transition ${
                      tradeType === trade.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-2xl">{trade.icon}</span>
                    <div className="font-medium text-stone-800 mt-1">{trade.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Business Hours */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">When are you available?</h2>
              <p className="text-stone-600 mb-6">The AI will let customers know your operating hours.</p>
              
              <div className="space-y-3">
                {Object.entries(businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-3">
                    <label className="flex items-center gap-2 w-28">
                      <input
                        type="checkbox"
                        checked={hours.enabled}
                        onChange={(e) =>
                          setBusinessHours({
                            ...businessHours,
                            [day]: { ...hours, enabled: e.target.checked },
                          })
                        }
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="capitalize text-stone-700">{day}</span>
                    </label>
                    
                    {hours.enabled && (
                      <div className="flex items-center gap-2 text-sm">
                        <input
                          type="time"
                          value={hours.start}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, start: e.target.value },
                            })
                          }
                          className="px-2 py-1 border border-stone-300 rounded-lg"
                        />
                        <span className="text-stone-500">to</span>
                        <input
                          type="time"
                          value={hours.end}
                          onChange={(e) =>
                            setBusinessHours({
                              ...businessHours,
                              [day]: { ...hours, end: e.target.value },
                            })
                          }
                          className="px-2 py-1 border border-stone-300 rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Phone Setup */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">Your business phone</h2>
              <p className="text-stone-600 mb-6">
                We'll forward missed calls to your BookFox AI number. You'll get a dedicated number after setup.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Main Business Phone
                </label>
                <input
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="(555) 123-4567"
                />
                <p className="text-xs text-stone-500 mt-2">
                  💡 After setup, you'll configure call forwarding from this number to your BookFox number.
                </p>
              </div>
            </div>
          )}

          {/* Step 4: AI Settings */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-2">Customize your AI</h2>
              <p className="text-stone-600 mb-6">Make BookFox feel like part of your team.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    AI Assistant Name
                  </label>
                  <input
                    type="text"
                    value={assistantName}
                    onChange={(e) => setAssistantName(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    placeholder="BookFox"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    The AI will introduce itself with this name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Services You Offer
                  </label>
                  <textarea
                    value={services}
                    onChange={(e) => setServices(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                    placeholder="Water heater repair, drain cleaning, pipe installation..."
                    rows={3}
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Comma-separated list — helps the AI understand what you do
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Finish Setup'}
                <Check className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

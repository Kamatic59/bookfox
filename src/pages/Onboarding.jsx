import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import Toggle from '../components/ui/Toggle';

// Premium step indicator
function StepIndicator({ currentStep, totalSteps }) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 mb-6 md:mb-8 px-4 overflow-x-auto">
      {[...Array(totalSteps)].map((_, i) => (
        <div key={i} className="flex items-center flex-shrink-0">
          <div
            className={`relative flex items-center justify-center transition-all duration-500 ${
              i <= currentStep ? 'scale-100' : 'scale-90 opacity-50'
            }`}
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-semibold text-xs md:text-sm transition-all duration-500 ${
                i < currentStep
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/40'
                  : i === currentStep
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 ring-4 ring-blue-400/30'
                  : 'bg-stone-200 text-stone-400'
              }`}
            >
              {i < currentStep ? (
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-6 md:w-12 h-1 mx-1 md:mx-2 rounded-full transition-all duration-500 ${
              i < currentStep ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-stone-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
}

// Business name step
function BusinessNameStep({ value, onChange }) {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/40 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">What's your business called?</h2>
        <p className="text-stone-500 text-base md:text-lg">
          This is how customers will see you
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Smith's Plumbing"
            className="w-full px-5 py-4 bg-gradient-to-r from-stone-50 to-blue-50 border-2 border-stone-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 focus:from-white focus:to-blue-50 outline-none transition-all text-lg font-medium"
            autoFocus
          />
        </div>
        <p className="text-stone-400 text-sm mt-3 text-center">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}

// Trade type selection
function TradeTypeStep({ value, onChange }) {
  const trades = [
    { id: 'plumber', icon: '🔧', label: 'Plumbing', color: 'from-blue-500 to-cyan-500' },
    { id: 'hvac', icon: '❄️', label: 'HVAC', color: 'from-sky-500 to-blue-500' },
    { id: 'electrician', icon: '⚡', label: 'Electrical', color: 'from-amber-500 to-orange-500' },
    { id: 'roofer', icon: '🏠', label: 'Roofing', color: 'from-stone-500 to-stone-600' },
    { id: 'landscaper', icon: '🌿', label: 'Landscaping', color: 'from-emerald-500 to-green-500' },
    { id: 'handyman', icon: '🛠️', label: 'Handyman', color: 'from-orange-500 to-red-500' },
    { id: 'painter', icon: '🎨', label: 'Painting', color: 'from-purple-500 to-pink-500' },
    { id: 'other', icon: '📦', label: 'Other', color: 'from-indigo-500 to-purple-500' },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-orange-500/40 mb-4">
          <span className="text-3xl">🛠️</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">What's your trade?</h2>
        <p className="text-stone-500 text-base md:text-lg">
          We'll customize your AI for your industry
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {trades.map((trade) => (
          <button
            key={trade.id}
            onClick={() => onChange(trade.id)}
            className={`group relative p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 active:scale-95 overflow-hidden ${
              value === trade.id
                ? 'border-transparent shadow-xl scale-[1.02]'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-lg bg-white'
            }`}
          >
            {/* Background gradient when selected */}
            {value === trade.id && (
              <div className={`absolute inset-0 bg-gradient-to-br ${trade.color} opacity-10`} />
            )}
            
            <div className="relative">
              <div className={`text-3xl md:text-4xl mb-2 transition-transform duration-300 ${
                value === trade.id ? 'scale-110' : 'group-hover:scale-110'
              }`}>
                {trade.icon}
              </div>
              <div className={`font-semibold text-sm md:text-base transition-colors ${
                value === trade.id ? 'text-stone-800' : 'text-stone-700'
              }`}>
                {trade.label}
              </div>
            </div>
            
            {value === trade.id && (
              <div className={`absolute top-2 right-2 w-6 h-6 bg-gradient-to-br ${trade.color} rounded-full flex items-center justify-center shadow-lg`}>
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
      }
    });
    onChange(newValue);
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/40 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Your business hours</h2>
        <p className="text-stone-500 text-base md:text-lg">
          When should BookFox catch your calls?
        </p>
      </div>

      {/* Quick select */}
      <div className="flex gap-2 justify-center mb-5">
        <button
          onClick={() => setQuickHours('weekdays')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-blue-700 text-sm font-semibold transition-all active:scale-95 border border-blue-200"
        >
          Mon-Fri
        </button>
        <button
          onClick={() => setQuickHours('allweek')}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 text-blue-700 text-sm font-semibold transition-all active:scale-95 border border-blue-200"
        >
          7 Days
        </button>
      </div>
      
      <div className="space-y-2 max-w-lg mx-auto">
        {days.map((day) => {
          const dayData = value[day.id] || { enabled: !['saturday', 'sunday'].includes(day.id), start: '08:00', end: '17:00' };
          
          return (
            <div
              key={day.id}
              className={`p-3 rounded-xl transition-all duration-300 ${
                dayData.enabled 
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm' 
                  : 'bg-stone-100/50 border-2 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleDay(day.id)}
                  className="flex items-center gap-3 flex-1 min-h-[44px]"
                >
                  <span className={`font-semibold ${dayData.enabled ? 'text-stone-800' : 'text-stone-400'}`}>
                    <span className="md:hidden">{day.short}</span>
                    <span className="hidden md:inline">{day.label}</span>
                  </span>
                </button>
                
                <div className="flex items-center gap-3">
                  {!dayData.enabled && (
                    <span className="text-stone-400 text-sm">Closed</span>
                  )}
                  <Toggle checked={dayData.enabled} onChange={() => toggleDay(day.id)} />
                </div>
              </div>
              
              {dayData.enabled && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="time"
                    value={dayData.start}
                    onChange={(e) => updateTime(day.id, 'start', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-blue-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <span className="text-blue-400 text-sm font-medium">to</span>
                  <input
                    type="time"
                    value={dayData.end}
                    onChange={(e) => updateTime(day.id, 'end', e.target.value)}
                    className="flex-1 min-w-0 px-3 py-2 border border-blue-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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

// AI Behavior customization
function AiBehaviorStep({ value, onChange }) {
  const tones = [
    { id: 'friendly', label: 'Friendly', emoji: '😊', color: 'from-amber-400 to-orange-500' },
    { id: 'professional', label: 'Professional', emoji: '👔', color: 'from-blue-500 to-indigo-600' },
    { id: 'casual', label: 'Casual', emoji: '🤙', color: 'from-emerald-400 to-teal-500' },
  ];

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  const options = [
    {
      id: 'requireApproval',
      title: 'Require approval before booking',
      desc: 'AI confirms with you before adding appointments',
      icon: '📋',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'handleEmergencies',
      title: 'Handle emergencies after hours',
      desc: 'Escalate urgent issues outside business hours',
      icon: '🚨',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'autoQualify',
      title: 'Auto-qualify leads',
      desc: 'Ask about service, urgency, and property type',
      icon: '✅',
      color: 'from-emerald-500 to-green-500'
    },
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/40 mb-4">
          <span className="text-3xl">🤖</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">How should your AI behave?</h2>
        <p className="text-stone-500 text-base md:text-lg">
          Customize how BookFox handles customers
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Tone selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-600 mb-3 uppercase tracking-wide">Response Tone</label>
          <div className="grid grid-cols-3 gap-3">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => updateField('tone', tone.id)}
                className={`relative p-4 rounded-xl border-2 transition-all text-center active:scale-95 overflow-hidden ${
                  value.tone === tone.id
                    ? 'border-transparent shadow-lg scale-[1.02]'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                {value.tone === tone.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tone.color} opacity-15`} />
                )}
                <div className="relative">
                  <div className="text-2xl mb-1">{tone.emoji}</div>
                  <div className={`font-semibold text-sm ${value.tone === tone.id ? 'text-stone-800' : 'text-stone-600'}`}>
                    {tone.label}
                  </div>
                </div>
                {value.tone === tone.id && (
                  <div className={`absolute top-1.5 right-1.5 w-5 h-5 bg-gradient-to-br ${tone.color} rounded-full flex items-center justify-center`}>
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle options */}
        <div className="space-y-3">
          {options.map((option) => {
            const isOn = option.id === 'autoQualify' ? value[option.id] !== false : value[option.id] || false;
            
            return (
              <div
                key={option.id}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 cursor-pointer ${
                  isOn
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm'
                    : 'bg-stone-100/50 border-2 border-transparent hover:bg-stone-100'
                }`}
                onClick={() => updateField(option.id, !isOn)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center text-xl shadow-lg ${isOn ? 'shadow-blue-500/30' : 'opacity-50'}`}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold ${isOn ? 'text-stone-800' : 'text-stone-500'}`}>{option.title}</div>
                  <div className="text-sm text-stone-500 truncate">{option.desc}</div>
                </div>
                <Toggle checked={isOn} onChange={() => updateField(option.id, !isOn)} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Custom instructions
function CustomInstructionsStep({ value, onChange, businessName }) {
  const examples = [
    "Always mention we offer free estimates",
    "We don't do commercial properties",
    "Mention our 24/7 emergency line",
    "We're family-owned since 1985",
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Anything else to know?</h2>
        <p className="text-stone-500 text-base md:text-lg">
          Give your AI special instructions
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <textarea
            value={value.customInstructions || ''}
            onChange={(e) => onChange({ ...value, customInstructions: e.target.value })}
            placeholder="Add any special instructions for how the AI should respond..."
            rows={4}
            className="w-full px-4 py-3 bg-gradient-to-r from-stone-50 to-indigo-50 border-2 border-stone-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none text-stone-700"
          />
        </div>

        {/* Quick add suggestions */}
        <div className="flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => {
                const current = value.customInstructions || '';
                const newValue = current ? `${current}\n${example}` : example;
                onChange({ ...value, customInstructions: newValue });
              }}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 text-indigo-700 text-xs font-semibold transition-all border border-indigo-200"
            >
              + {example}
            </button>
          ))}
        </div>

        {/* Preview */}
        {value.customInstructions && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <img src="/logo.png" alt="" className="w-4 h-4" />
              </div>
              <span className="font-semibold text-indigo-800 text-sm">AI will remember</span>
            </div>
            <p className="text-indigo-700 text-sm">
              "{value.customInstructions.slice(0, 150)}{value.customInstructions.length > 150 ? '...' : ''}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// AI name step
function AiNameStep({ value, onChange, businessName }) {
  const names = ['BookFox', 'Alex', 'Sam', 'Jamie', 'Casey', 'Riley'];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/40 mb-4">
          <img src="/logo.png" alt="" className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">Name your AI assistant</h2>
        <p className="text-stone-500 text-base md:text-lg">
          Give it a personality that matches your brand
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-6">
        <input
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="BookFox"
          className="w-full px-5 py-4 bg-gradient-to-r from-stone-50 to-blue-50 border-2 border-stone-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-lg font-medium text-center"
        />

        {/* Quick select names */}
        <div className="flex flex-wrap gap-2 justify-center">
          {names.map((name) => (
            <button
              key={name}
              onClick={() => onChange({ ...value, name })}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                value.name === name
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40'
                  : 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 hover:from-blue-500/20 hover:to-indigo-500/20 border border-blue-200'
              }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Message preview */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/40">
              <img src="/logo.png" alt="" className="w-7 h-7" />
            </div>
            <div className="bg-white rounded-2xl rounded-tl-md p-4 shadow-sm flex-1 border border-blue-100">
              <p className="text-stone-700 leading-relaxed">
                Hi! This is <span className="font-bold text-blue-600">{value.name || 'BookFox'}</span> from {businessName || 'your business'}. 
                I noticed we missed your call. How can I help? 🦊
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
    <div className="text-center animate-fadeIn">
      <div className="relative mb-6">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 shadow-2xl shadow-emerald-500/50 mb-4">
          <span className="text-5xl">🎉</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-emerald-500/20 rounded-full animate-ping" />
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-3">You're all set!</h2>
      <p className="text-stone-600 text-lg mb-8">
        BookFox is ready for <span className="font-bold text-blue-600">{businessName}</span>
      </p>
      
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-6 text-left max-w-md mx-auto shadow-lg shadow-emerald-500/20">
        <h4 className="font-bold text-emerald-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          Next steps
        </h4>
        <ul className="space-y-3">
          {[
            { text: 'Set up call forwarding', icon: '📞' },
            { text: 'Test your BookFox number', icon: '✅' },
            { text: 'Watch the leads roll in!', icon: '🚀' },
          ].map((step, i) => (
            <li key={i} className="flex items-center gap-3 text-emerald-700 font-medium">
              <span className="text-xl">{step.icon}</span>
              <span>{step.text}</span>
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
  const [businessName, setBusinessName] = useState('');
  
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
  const [aiBehavior, setAiBehavior] = useState({
    tone: 'friendly',
    requireApproval: false,
    handleEmergencies: true,
    autoQualify: true,
    customInstructions: '',
  });
  const [aiSettings, setAiSettings] = useState({ name: 'BookFox' });

  const needsBusinessCreation = !business;
  const totalSteps = needsBusinessCreation ? 7 : 6;

  const canContinue = () => {
    const offset = needsBusinessCreation ? 0 : 1;
    const actualStep = step + offset;
    
    switch (actualStep) {
      case 0: return businessName.trim().length >= 2;
      case 1: return !!tradeType;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      case 5: return !!aiSettings.name;
      case 6: return true;
      default: return false;
    }
  };

  const handleNext = async () => {
    setError(null);
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      
      try {
        let currentBusiness = business;
        
        if (!currentBusiness && user) {
          console.log('Creating business...');
          const { data: newBusiness, error: bizError } = await supabase
            .from('businesses')
            .insert({ name: businessName.trim() })
            .select()
            .single();

          if (bizError) {
            console.error('Business creation error:', bizError);
            throw new Error(`Failed to create business: ${bizError.message}`);
          }

          console.log('Creating team member...');
          const { error: teamError } = await supabase
            .from('team_members')
            .insert({
              user_id: user.id,
              business_id: newBusiness.id,
              role: 'owner',
            });

          if (teamError) {
            console.error('Team member error:', teamError);
            throw new Error(`Failed to create team member: ${teamError.message}`);
          }

          currentBusiness = newBusiness;
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (currentBusiness) {
          console.log('Updating business settings...');
          const { error: updateError } = await supabase
            .from('businesses')
            .update({
              trade_type: tradeType,
              business_hours: hours,
            })
            .eq('id', currentBusiness.id);

          if (updateError) {
            console.error('Business update error:', updateError);
            throw new Error(`Failed to update business: ${updateError.message}`);
          }

          console.log('Updating AI settings...');
          await supabase
            .from('ai_settings')
            .update({ assistant_name: aiSettings.name })
            .eq('business_id', currentBusiness.id);
        }

        await refreshBusiness();
        navigate('/dashboard');
        
      } catch (err) {
        console.error('Onboarding error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStep = () => {
    const offset = needsBusinessCreation ? 0 : 1;
    const actualStep = step + offset;
    const displayName = needsBusinessCreation ? businessName : business?.name;

    switch (actualStep) {
      case 0: return <BusinessNameStep value={businessName} onChange={setBusinessName} />;
      case 1: return <TradeTypeStep value={tradeType} onChange={setTradeType} />;
      case 2: return <HoursStep value={hours} onChange={setHours} />;
      case 3: return <AiBehaviorStep value={aiBehavior} onChange={setAiBehavior} />;
      case 4: return <CustomInstructionsStep value={aiBehavior} onChange={setAiBehavior} businessName={displayName} />;
      case 5: return <AiNameStep value={aiSettings} onChange={setAiSettings} businessName={displayName} />;
      case 6: return <SuccessStep businessName={displayName} />;
      default: return null;
    }
  };

  const isSuccessStep = step === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Colorful background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-400/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400/30 to-pink-400/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-amber-300/20 to-orange-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/50">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10" />
              <span className="text-2xl font-bold text-stone-800">
                Book<span className="text-blue-600">Fox</span>
              </span>
            </div>
          </div>

          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          {/* Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl shadow-indigo-500/10 p-5 md:p-10 border border-white/60">
            {error && (
              <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold">Something went wrong</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            <div className="min-h-[380px] md:min-h-[420px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-5 border-t border-stone-200/50">
              {step > 0 && !isSuccessStep ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 text-stone-600 font-semibold hover:text-stone-800 hover:bg-stone-100/50 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="hidden md:inline">Back</span>
                </button>
              ) : (
                <div />
              )}
              
              <button
                onClick={handleNext}
                disabled={!canContinue() || loading}
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                {loading ? (
                  <>
                    <img src="/logo.png" alt="" className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isSuccessStep ? (
                  <>
                    Go to Dashboard
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                ) : (
                  <>
                    Continue
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {!isSuccessStep && (
            <p className="text-center mt-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors"
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

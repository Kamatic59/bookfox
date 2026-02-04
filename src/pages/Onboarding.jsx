import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

// Premium step indicator with animation
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
                  ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : i === currentStep
                  ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20'
                  : 'bg-stone-100 text-stone-400'
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
              i < currentStep ? 'bg-emerald-400' : 'bg-stone-200'
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
      <div className="text-center mb-8 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Let's get started
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">What's your business called?</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
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

// Trade type selection
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
      <div className="text-center mb-8 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 1
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">What's your trade?</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
          We'll customize your AI assistant to speak your customers' language
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {trades.map((trade) => (
          <button
            key={trade.id}
            onClick={() => onChange(trade.id)}
            className={`group relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-300 active:scale-95 ${
              value === trade.id
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-500/20'
                : 'border-stone-200 hover:border-blue-300 hover:shadow-lg bg-white'
            }`}
          >
            <div className={`text-3xl md:text-4xl mb-2 md:mb-3 transition-transform duration-300 ${
              value === trade.id ? 'scale-110' : 'group-hover:scale-110'
            }`}>
              {trade.icon}
            </div>
            <div className={`font-semibold text-sm md:text-base mb-0.5 md:mb-1 transition-colors ${
              value === trade.id ? 'text-blue-700' : 'text-stone-700'
            }`}>
              {trade.label}
            </div>
            <div className="text-xs text-stone-500 hidden md:block">{trade.desc}</div>
            {value === trade.id && (
              <div className="absolute top-2 right-2 md:top-3 md:right-3 w-5 h-5 md:w-6 md:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="text-center mb-6 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 2
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
              
              {/* Time inputs */}
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

// AI Behavior customization - NEW
function AiBehaviorStep({ value, onChange }) {
  const tones = [
    { id: 'friendly', label: 'Friendly', desc: 'Warm and personable', emoji: '😊' },
    { id: 'professional', label: 'Professional', desc: 'Business-like and polished', emoji: '👔' },
    { id: 'casual', label: 'Casual', desc: 'Relaxed and approachable', emoji: '🤙' },
  ];

  const updateField = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 3
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">How should your AI behave?</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
          Customize how BookFox handles customers
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-6">
        {/* Tone selection */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">Response Tone</label>
          <div className="grid grid-cols-3 gap-3">
            {tones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => updateField('tone', tone.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center active:scale-95 ${
                  value.tone === tone.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-stone-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl mb-1">{tone.emoji}</div>
                <div className={`font-medium text-sm ${value.tone === tone.id ? 'text-blue-700' : 'text-stone-700'}`}>
                  {tone.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle options */}
        <div className="space-y-4">
          {/* Require approval */}
          <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-blue-200 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={value.requireApproval || false}
              onChange={(e) => updateField('requireApproval', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-stone-800">Require approval before booking</div>
              <div className="text-sm text-stone-500">AI will confirm with you before adding appointments to your calendar</div>
            </div>
          </label>

          {/* Emergency handling */}
          <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-blue-200 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={value.handleEmergencies || false}
              onChange={(e) => updateField('handleEmergencies', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-stone-800">Handle emergencies after hours</div>
              <div className="text-sm text-stone-500">AI will escalate urgent issues (burst pipes, no heat, etc.) even outside business hours</div>
            </div>
          </label>

          {/* Auto-qualify */}
          <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-stone-200 hover:border-blue-200 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={value.autoQualify !== false}
              onChange={(e) => updateField('autoQualify', e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="font-medium text-stone-800">Auto-qualify leads</div>
              <div className="text-sm text-stone-500">AI will ask about service needed, urgency, and property type</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Custom instructions - like a system prompt
function CustomInstructionsStep({ value, onChange, businessName }) {
  const examples = [
    "Always mention we offer free estimates",
    "We don't work on commercial properties",
    "Mention our 24/7 emergency line for urgent issues",
    "We're family-owned since 1985",
  ];

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 4
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">Anything else to know?</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
          Give your AI special instructions about your business
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-3">
            Custom Instructions <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <textarea
            value={value.customInstructions || ''}
            onChange={(e) => onChange({ ...value, customInstructions: e.target.value })}
            placeholder="Add any special instructions for how the AI should respond to customers..."
            rows={4}
            className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        {/* Example suggestions */}
        <div>
          <p className="text-sm text-stone-500 mb-2">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, i) => (
              <button
                key={i}
                onClick={() => {
                  const current = value.customInstructions || '';
                  const newValue = current ? `${current}\n${example}` : example;
                  onChange({ ...value, customInstructions: newValue });
                }}
                className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-blue-100 hover:text-blue-700 text-stone-600 text-xs font-medium transition-all"
              >
                + {example}
              </button>
            ))}
          </div>
        </div>

        {/* Preview card */}
        <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-xl p-4 border border-stone-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <img src="/logo.png" alt="" className="w-5 h-5 object-contain" />
            </div>
            <span className="font-medium text-stone-700">{businessName || 'Your Business'}'s AI</span>
          </div>
          <p className="text-stone-600 text-sm">
            {value.customInstructions 
              ? `I'll remember: "${value.customInstructions.slice(0, 100)}${value.customInstructions.length > 100 ? '...' : ''}"`
              : "No special instructions yet — I'll use smart defaults!"}
          </p>
        </div>
      </div>
    </div>
  );
}

// AI name step
function AiNameStep({ value, onChange, businessName }) {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8 md:mb-10">
        <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-4">
          Step 5
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">Name your AI assistant</h2>
        <p className="text-stone-500 text-base md:text-lg max-w-md mx-auto">
          Give it a personality that matches your brand
        </p>
      </div>
      
      <div className="max-w-lg mx-auto space-y-6">
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
        <div className="bg-gradient-to-br from-stone-100 to-stone-50 rounded-2xl p-5 border border-stone-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Live Preview</span>
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
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

// Success step
function SuccessStep({ businessName }) {
  return (
    <div className="text-center animate-fadeIn">
      <div className="relative mb-8">
        <div className="text-7xl md:text-8xl animate-bounce">🎉</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-500/10 rounded-full animate-ping" />
        </div>
      </div>
      
      <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">You're all set!</h2>
      <p className="text-stone-600 text-lg md:text-xl mb-8 md:mb-10 max-w-md mx-auto">
        BookFox is ready to catch leads for <span className="font-semibold">{businessName}</span>
      </p>
      
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-2xl p-6 md:p-8 text-left max-w-md mx-auto">
        <h4 className="font-bold text-emerald-800 text-lg mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
          Next steps
        </h4>
        <ul className="space-y-3 md:space-y-4">
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
  const [aiBehavior, setAiBehavior] = useState({
    tone: 'friendly',
    requireApproval: false,
    handleEmergencies: true,
    autoQualify: true,
    customInstructions: '',
  });
  const [aiSettings, setAiSettings] = useState({ name: 'BookFox' });

  // Step configuration
  const needsBusinessCreation = !business;
  const totalSteps = needsBusinessCreation ? 7 : 6;

  const canContinue = () => {
    const offset = needsBusinessCreation ? 0 : 1;
    const actualStep = step + offset;
    
    switch (actualStep) {
      case 0: return businessName.trim().length >= 2;
      case 1: return !!tradeType;
      case 2: return true; // hours
      case 3: return true; // AI behavior
      case 4: return true; // custom instructions
      case 5: return !!aiSettings.name;
      case 6: return true; // success
      default: return false;
    }
  };

  const handleNext = async () => {
    setError(null);
    
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      // Save and finish
      setLoading(true);
      
      try {
        let currentBusiness = business;
        
        // Create business if needed
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
          
          console.log('Business created:', newBusiness.id);

          // Create team member link
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
          
          // Wait a moment for the ai_settings trigger to fire
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        if (currentBusiness) {
          console.log('Updating business settings...');
          
          // Update business
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

          // Update AI settings
          console.log('Updating AI settings...');
          const { error: aiError } = await supabase
            .from('ai_settings')
            .update({
              assistant_name: aiSettings.name,
              // Store behavior settings in a JSON column or separate fields
              // For now, we'll add these to a custom_settings JSON field
            })
            .eq('business_id', currentBusiness.id);

          if (aiError) {
            console.error('AI settings error:', aiError);
            // Don't throw - AI settings might not exist yet
          }
        }

        console.log('Refreshing business...');
        await refreshBusiness();
        
        console.log('Navigating to dashboard...');
        navigate('/dashboard');
        
      } catch (err) {
        console.error('Onboarding error:', err);
        setError(err.message || 'Something went wrong. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  // Render correct step based on whether we need business creation
  const renderStep = () => {
    const offset = needsBusinessCreation ? 0 : 1;
    const actualStep = step + offset;
    const displayName = needsBusinessCreation ? businessName : business?.name;

    switch (actualStep) {
      case 0:
        return <BusinessNameStep value={businessName} onChange={setBusinessName} />;
      case 1:
        return <TradeTypeStep value={tradeType} onChange={setTradeType} />;
      case 2:
        return <HoursStep value={hours} onChange={setHours} />;
      case 3:
        return <AiBehaviorStep value={aiBehavior} onChange={setAiBehavior} />;
      case 4:
        return <CustomInstructionsStep value={aiBehavior} onChange={setAiBehavior} businessName={displayName} />;
      case 5:
        return <AiNameStep value={aiSettings} onChange={setAiSettings} businessName={displayName} />;
      case 6:
        return <SuccessStep businessName={displayName} />;
      default:
        return null;
    }
  };

  const isSuccessStep = step === totalSteps - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-blue-50/30 to-indigo-50/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-8 md:py-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <img src="/logo.png" alt="BookFox" className="w-10 h-10 md:w-14 md:h-14" />
              <span className="text-2xl md:text-3xl font-bold text-stone-800">
                Book<span className="text-blue-600">Fox</span>
              </span>
            </div>
          </div>

          {/* Progress */}
          <StepIndicator currentStep={step} totalSteps={totalSteps} />

          {/* Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl shadow-stone-900/10 p-5 md:p-12 border border-white/50">
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">Something went wrong</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* Step Content */}
            <div className="min-h-[350px] md:min-h-[400px]">
              {renderStep()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 md:mt-10 pt-5 md:pt-6 border-t border-stone-100">
              {step > 0 && !isSuccessStep ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-4 md:px-6 py-3 text-stone-600 font-medium hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-all"
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
                className="flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
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
          {!isSuccessStep && (
            <p className="text-center mt-4 md:mt-6">
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

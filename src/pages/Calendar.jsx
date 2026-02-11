import { useState } from 'react';
import { FadeIn, GlassCard } from '../components/shared/Animations';

// Mock appointments data
const mockAppointments = [
  { id: 1, title: 'Pipe Repair', customer: 'John Smith', phone: '(385) 555-0101', time: '9:00 AM', duration: '2h', status: 'confirmed', address: '123 Main St' },
  { id: 2, title: 'Water Heater Install', customer: 'Sarah Johnson', phone: '(385) 555-0102', time: '11:30 AM', duration: '3h', status: 'confirmed', address: '456 Oak Ave' },
  { id: 3, title: 'Drain Cleaning', customer: 'Mike Davis', phone: '(385) 555-0103', time: '3:00 PM', duration: '1h', status: 'pending', address: '789 Pine St' },
];

// Calendar day component
function CalendarDay({ date, isToday, isSelected, hasAppointments, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 ${
        isSelected
          ? 'bg-primary-600 text-white font-bold shadow-lg shadow-primary-500/30'
          : isToday
          ? 'bg-primary-100 text-primary-700 font-medium'
          : 'hover:bg-stone-100 active:bg-stone-200 text-stone-700'
      }`}
    >
      {date.getDate()}
      {hasAppointments && !isSelected && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
      )}
    </button>
  );
}

// Appointment card
function AppointmentCard({ appointment, delay = 0 }) {
  const statusColors = {
    confirmed: 'border-l-emerald-500 bg-green-50/50',
    pending: 'border-l-amber-500 bg-amber-50/50',
    cancelled: 'border-l-red-500 bg-red-50/50',
  };

  return (
    <FadeIn delay={delay}>
      <div className={`border-l-4 ${statusColors[appointment.status]} rounded-xl p-4 bg-white shadow-sm hover:shadow-md active:shadow-sm transition-all duration-200`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-stone-800 truncate">{appointment.title}</h4>
            <p className="text-stone-600 text-sm truncate">{appointment.customer}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ${
            appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
            appointment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {appointment.status}
          </span>
        </div>
        
        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-stone-600">
            <span className="text-base">🕐</span>
            <span>{appointment.time} ({appointment.duration})</span>
          </div>
          <div className="flex items-center gap-2 text-stone-600">
            <span className="text-base">📍</span>
            <span className="truncate">{appointment.address}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 py-2 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-lg text-sm font-medium text-stone-700 transition-colors">
            Reschedule
          </button>
          <button className="flex-1 py-2 px-3 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary-500/20">
            Details
          </button>
        </div>
      </div>
    </FadeIn>
  );
}

// Generate calendar days
function generateCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];
  
  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null);
  }
  
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }
  
  return days;
}

export default function Calendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today);

  const days = generateCalendarDays(currentYear, currentMonth);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const dayNamesFull = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-slate-800">Calendar</h1>
            <p className="text-slate-600 mt-1 text-sm sm:text-base">Manage your appointments</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-lg shadow-primary-500/20 sm:w-auto w-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Calendar */}
        <FadeIn delay={50}>
          <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-stone-800">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-1">
                <button 
                  onClick={goToPrevMonth}
                  className="p-2 hover:bg-stone-100 active:bg-stone-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextMonth}
                  className="p-2 hover:bg-stone-100 active:bg-stone-200 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {(window.innerWidth < 640 ? dayNames : dayNamesFull).map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-stone-500 py-2">
                  {window.innerWidth < 640 ? dayNames[i] : dayNamesFull[i]}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, i) => (
                <div key={i} className="flex justify-center py-0.5">
                  {date ? (
                    <CalendarDay
                      date={date}
                      isToday={date.toDateString() === today.toDateString()}
                      isSelected={date.toDateString() === selectedDate.toDateString()}
                      hasAppointments={date.getDate() % 3 === 0}
                      onClick={() => setSelectedDate(date)}
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10" />
                  )}
                </div>
              ))}
            </div>

            {/* Today button */}
            <button 
              onClick={() => setSelectedDate(today)}
              className="w-full mt-4 py-2 text-sm text-primary-600 hover:bg-primary-50 active:bg-primary-100 rounded-lg transition-colors font-medium"
            >
              Today
            </button>
          </div>
        </FadeIn>

        {/* Appointments */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Selected Day */}
          <FadeIn delay={100}>
            <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-stone-800">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <p className="text-stone-500 text-sm">
                    {mockAppointments.length} appointments
                  </p>
                </div>
              </div>

              {mockAppointments.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl sm:text-3xl">📅</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-stone-800 mb-1">No appointments</h3>
                  <p className="text-stone-500 text-sm">Nothing scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockAppointments.map((appointment, i) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} delay={i * 50} />
                  ))}
                </div>
              )}
            </div>
          </FadeIn>

          {/* Upcoming */}
          <FadeIn delay={150}>
            <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-stone-800 mb-4">Upcoming This Week</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <FadeIn key={i} delay={200 + i * 50}>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 hover:bg-stone-50 active:bg-stone-100 rounded-xl transition-colors cursor-pointer">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-100 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] sm:text-xs text-primary-600 font-medium">Feb</span>
                        <span className="text-base sm:text-lg font-bold text-primary-700">{5 + i}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">Water Heater Inspection</p>
                        <p className="text-stone-500 text-sm truncate">9:00 AM • Sarah Johnson</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 flex-shrink-0">
                        Confirmed
                      </span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

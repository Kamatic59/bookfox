import { useState } from 'react';
import { FadeIn, OrganicCard } from '../components/shared/Animations';

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
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 font-['Plus_Jakarta_Sans'] ${isSelected
          ? 'bg-[#2E4036] text-[#F2F0E9] font-bold shadow-md shadow-[#2E4036]/30'
          : isToday
            ? 'bg-[#2E4036]/10 text-[#2E4036] font-medium'
            : 'hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 text-[#1A1A1A]'
        }`}
    >
      {date.getDate()}
      {hasAppointments && !isSelected && (
        <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#CC5833]" />
      )}
    </button>
  );
}

// Appointment card
function AppointmentCard({ appointment, delay = 0 }) {
  const statusColors = {
    confirmed: 'border-l-[#2E4036] bg-[#2E4036]/5',
    pending: 'border-l-[#CC5833] bg-[#CC5833]/5',
    cancelled: 'border-l-[#1A1A1A]/30 bg-[#1A1A1A]/5',
  };

  return (
    <FadeIn delay={delay}>
      <div className={`border-l-4 ${statusColors[appointment.status]} rounded-xl p-4 bg-[#F2F0E9]/90 shadow-sm hover:shadow-md active:shadow-sm transition-all duration-200`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="font-semibold text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">{appointment.title}</h4>
            <p className="text-[#2E4036]/70 text-sm truncate font-['Outfit']">{appointment.customer}</p>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 font-['IBM_Plex_Mono'] ${appointment.status === 'confirmed' ? 'bg-[#2E4036]/10 text-[#2E4036]' :
              appointment.status === 'pending' ? 'bg-[#CC5833]/10 text-[#CC5833]' :
                'bg-[#1A1A1A]/10 text-[#1A1A1A]/60'
            }`}>
            {appointment.status}
          </span>
        </div>

        <div className="mt-3 space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-[#2E4036]/70 font-['Outfit']">
            <span className="text-base">🕐</span>
            <span>{appointment.time} ({appointment.duration})</span>
          </div>
          <div className="flex items-center gap-2 text-[#2E4036]/70 font-['Outfit']">
            <span className="text-base">📍</span>
            <span className="truncate">{appointment.address}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 py-2 px-3 bg-[#2E4036]/5 hover:bg-[#2E4036]/10 active:bg-[#2E4036]/15 rounded-lg text-sm font-medium text-[#2E4036] transition-colors font-['Plus_Jakarta_Sans']">
            Reschedule
          </button>
          <button className="flex-1 py-2 px-3 bg-[#2E4036] hover:bg-[#1A1A1A] text-[#F2F0E9] rounded-lg text-sm font-medium transition-colors shadow-md shadow-[#2E4036]/20 font-['Plus_Jakarta_Sans']">
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
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-4xl font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">Calendar</h1>
            <p className="text-[#2E4036]/60 mt-1 text-sm sm:text-base font-['Outfit']">Manage your appointments</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2E4036] text-[#F2F0E9] font-medium rounded-full hover:bg-[#1A1A1A] transition-colors shadow-md shadow-[#2E4036]/20 sm:w-auto w-full font-['Plus_Jakarta_Sans']">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Appointment
          </button>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <FadeIn delay={50}>
          <OrganicCard className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <div className="flex gap-1">
                <button onClick={goToPrevMonth} className="p-2 hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-[#2E4036]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={goToNextMonth} className="p-2 hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-[#2E4036]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {(window.innerWidth < 640 ? dayNames : dayNamesFull).map((day, i) => (
                <div key={i} className="text-center text-xs font-medium text-[#2E4036]/50 py-2 font-['IBM_Plex_Mono']">
                  {window.innerWidth < 640 ? dayNames[i] : dayNamesFull[i]}
                </div>
              ))}
            </div>

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

            <button
              onClick={() => setSelectedDate(today)}
              className="w-full mt-4 py-2 text-sm text-[#CC5833] hover:bg-[#CC5833]/5 active:bg-[#CC5833]/10 rounded-lg transition-colors font-medium font-['Plus_Jakarta_Sans']"
            >
              Today
            </button>
          </OrganicCard>
        </FadeIn>

        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <FadeIn delay={100}>
            <OrganicCard className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-['Plus_Jakarta_Sans']">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h2>
                  <p className="text-[#2E4036]/60 text-sm font-['Outfit']">
                    {mockAppointments.length} appointments
                  </p>
                </div>
              </div>

              {mockAppointments.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#2E4036]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl sm:text-3xl">📅</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-[#1A1A1A] mb-1 font-['Plus_Jakarta_Sans']">No appointments</h3>
                  <p className="text-[#2E4036]/60 text-sm font-['Outfit']">Nothing scheduled for this day</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockAppointments.map((appointment, i) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} delay={i * 50} />
                  ))}
                </div>
              )}
            </OrganicCard>
          </FadeIn>

          <FadeIn delay={150}>
            <OrganicCard className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] mb-4 font-['Plus_Jakarta_Sans']">Upcoming This Week</h2>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <FadeIn key={i} delay={200 + i * 50}>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 hover:bg-[#2E4036]/5 active:bg-[#2E4036]/10 rounded-xl transition-colors cursor-pointer">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#2E4036]/10 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-[10px] sm:text-xs text-[#2E4036]/60 font-medium font-['IBM_Plex_Mono']">Feb</span>
                        <span className="text-base sm:text-lg font-bold text-[#2E4036] font-['Plus_Jakarta_Sans']">{5 + i}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#1A1A1A] truncate font-['Plus_Jakarta_Sans']">Water Heater Inspection</p>
                        <p className="text-[#2E4036]/60 text-sm truncate font-['Outfit']">9:00 AM • Sarah Johnson</p>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#2E4036]/10 text-[#2E4036] flex-shrink-0 font-['IBM_Plex_Mono']">
                        Confirmed
                      </span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </OrganicCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

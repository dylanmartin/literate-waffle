import React, { useState, useEffect } from 'react';
import { generateCalendarDays } from '../utils/dateHelpers';
import './Calendar.css';

const Calendar = () => {
  const [availableDates, setAvailableDates] = useState([]);
  const [dayRange, setDayRange] = useState(30); // Default to 30 days
  const [menuOpen, setMenuOpen] = useState(false); // Toggle for the menu bar

  // On initial load, retrieve available dates from localStorage
  useEffect(() => {
    const storedDates = localStorage.getItem('availableDates');
    if (storedDates) {
      setAvailableDates(JSON.parse(storedDates));
    }
  }, []);

  // Persist available dates to localStorage whenever they change
  useEffect(() => {
    if (availableDates.length > 0) {
      localStorage.setItem('availableDates', JSON.stringify(availableDates));
    }
  }, [availableDates]);

  // Get today's date
  const today = new Date();

  // Generate the days based on the selected range
  const fullGridDays = generateCalendarDays(today, dayRange);

  const toggleAvailability = (date) => {
    if (!date) return;
    const dateString = date.toDateString();
    if (availableDates.includes(dateString)) {
      setAvailableDates(availableDates.filter(d => d !== dateString));
    } else {
      setAvailableDates([...availableDates, dateString]);
    }
  };

  const handleRangeChange = (e) => {
    setDayRange(Number(e.target.value));
  };

  // Clear all availability
  const clearAvailability = () => {
    setAvailableDates([]);
    localStorage.removeItem('availableDates');
  };

  // Set all dates as available
  const setAllAvailable = () => {
    const allDates = fullGridDays.filter(day => day).map(day => day.toDateString());
    setAvailableDates(allDates);
  };

  return (
    <div className="calendar-container">
      <div className="menu-bar">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Hide Controls' : 'Show Controls'}
        </button>
      </div>

      {menuOpen && (
        <div className="menu-content">
          <RangeSelector onRangeChange={handleRangeChange} />
          <button className="clear-button" onClick={clearAvailability}>
            Clear All Availability
          </button>
          <button className="set-available-button" onClick={setAllAvailable}>
            Set All Dates as Available
          </button>
        </div>
      )}

      <CalendarHeader />
      <CalendarGrid fullGridDays={fullGridDays} availableDates={availableDates} toggleAvailability={toggleAvailability} />
    </div>
  );
};

// Component for selecting the range of days to display
const RangeSelector = ({ onRangeChange }) => (
  <div className="range-selector">
    <label>
      Select range of days:
      <input type="number" min="1" max="90" onChange={onRangeChange} defaultValue={30} />
    </label>
  </div>
);

// Calendar header component
const CalendarHeader = () => {
  const dayOfWeekHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <div className="calendar-header">
      {dayOfWeekHeaders.map((day, index) => (
        <div key={index} className="day-header">
          {day}
        </div>
      ))}
    </div>
  );
};

// Calendar grid component
const CalendarGrid = ({ fullGridDays, availableDates, toggleAvailability }) => (
  <div className="calendar-grid">
    {fullGridDays.map((day, index) => (
      <div
        key={index}
        className={`day ${day && availableDates.includes(day.toDateString()) ? 'available' : ''} ${!day ? 'empty' : ''}`}
        onClick={() => day && toggleAvailability(day)}
      >
        {day ? (
          <>
            <div className="date-number">{day.getDate()}</div>
            <div className="day-month">
              {day.toLocaleString('en-US', { weekday: 'short' })}{' '}
              {day.toLocaleString('en-US', { month: 'short' })}
            </div>
          </>
        ) : ''}
      </div>
    ))}
  </div>
);

export default Calendar;

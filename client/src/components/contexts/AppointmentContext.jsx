/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => {
    // Initialize appointment state from localStorage
    return JSON.parse(localStorage.getItem('appointments')) || {};
  });

  const [daysWithAppointments, setDaysWithAppointments] = useState(() => {
    // Initialize days with appointments state from localStorage
    return JSON.parse(localStorage.getItem('daysWithAppointments')) || '';
  });

  const [sessionsCompleted, setSessionsCompleted] = useState(() => {
    // Initialize days with appointments state from localStorage
    return JSON.parse(localStorage.getItem('sessionsCompleted')) || '';
  });

  const clearAppointments = () => {
    setAppointments('');
    setDaysWithAppointments('');
    setSessionsCompleted('');
  };

  useEffect(() => {
    // Update localStorage when appointments changes
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    // Update localStorage when appointments changes
    localStorage.setItem(
      'sessionsCompleted',
      JSON.stringify(sessionsCompleted)
    );
  }, [sessionsCompleted]);

  useEffect(() => {
    // Update localStorage when days with appointments changes
    localStorage.setItem(
      'daysWithAppointments',
      JSON.stringify(daysWithAppointments)
    );
  }, [daysWithAppointments]);

  const value = {
    appointments,
    setAppointments,
    daysWithAppointments,
    setDaysWithAppointments,
    sessionsCompleted,
    setSessionsCompleted,
    clearAppointments,
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppContext = () => useContext(AppointmentContext);

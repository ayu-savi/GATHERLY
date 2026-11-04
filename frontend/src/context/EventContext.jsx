import React, { createContext, useContext, useState } from 'react';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState(() => {
    try {
      const saved = localStorage.getItem('gatherly_saved_events');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem('gatherly_registrations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);

  const toggleSaveEvent = (eventId) => {
    setSavedEventIds((prev) => {
      const isSaved = prev.includes(eventId);
      const updated = isSaved ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('gatherly_saved_events', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const isEventSaved = (eventId) => savedEventIds.includes(eventId);

  const isUserRegistered = (eventId) =>
    registrations.some((reg) => reg.eventId === eventId);

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        savedEventIds,
        toggleSaveEvent,
        isEventSaved,
        registrations,
        setRegistrations,
        isUserRegistered,
        loading,
        setLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export default EventContext;


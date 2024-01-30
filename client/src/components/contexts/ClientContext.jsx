/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from 'react';

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [clients, setClients] = useState(() => {
    // Initialize client state from localStorage
    return JSON.parse(localStorage.getItem('clients')) || '';
  });

  const clearClients = () => {
    setClients('');
  };

  useEffect(() => {
    // Update localStorage when clients changes
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  const value = {
    clients,
    setClients,
    clearClients,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useAppContext = () => useContext(ClientContext);

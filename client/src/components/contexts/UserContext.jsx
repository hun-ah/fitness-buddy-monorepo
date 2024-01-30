/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react';
import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user state from localStorage or default to empty
    return JSON.parse(localStorage.getItem('user')) || '';
  });

  const clearUser = () => {
    setUser('');
  };

  useEffect(() => {
    // Update localStorage when user changes
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  const value = {
    user,
    setUser,
    clearUser,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useAppContext = () => useContext(UserContext);

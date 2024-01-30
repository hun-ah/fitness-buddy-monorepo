/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from 'react';

const IsLoadingContext = createContext();

export const IsLoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <IsLoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
    </IsLoadingContext.Provider>
  );
};

export const useAppContext = () => useContext(IsLoadingContext);

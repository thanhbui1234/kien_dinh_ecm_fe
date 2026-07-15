'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { AxiosInstance } from 'axios';

const ApiContext = createContext<AxiosInstance | null>(null);

export interface ApiProviderProps {
  client: AxiosInstance;
  children: ReactNode;
}

export const ApiProvider = ({ client, children }: ApiProviderProps) => {
  return <ApiContext.Provider value={client}>{children}</ApiContext.Provider>;
};

export const useApiClient = (): AxiosInstance => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiClient must be used within an ApiProvider');
  }
  return context;
};

import React, { createContext, useState, useContext } from 'react';

const PriceContext = createContext();

export const usePrice = () => useContext(PriceContext);

export const PriceProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0);

  return (
    <PriceContext.Provider value={{ totalPrice, setTotalPrice }}>
      {children}
    </PriceContext.Provider>
  );
};
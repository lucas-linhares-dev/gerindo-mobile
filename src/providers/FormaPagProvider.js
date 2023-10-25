import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormaPagActions } from '../actions/FormaPagActions';

const FormaPagContext = createContext();

export function useFormaPag() {
  return useContext(FormaPagContext);
}

export function FormaPagProvider({ children }) {
  const [formasPag, setformasPag] = useState([]);

  useEffect(() => {

    const fetchformasPag = async () => {
      try {
        const response = await FormaPagActions.GetAll()
        const data = await response.json();

        setformasPag(data);
      } catch (error) {
        console.error('Erro ao buscar formasPag:', error);
      }
    };

    fetchformasPag();
  }, []);

  return (
    <FormaPagContext.Provider value={{ formasPag }}>
      {children}
    </FormaPagContext.Provider>
  );
}

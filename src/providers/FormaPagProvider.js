import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormaPagActions } from '../actions/FormaPagActions';

// Crie um contexto para o FormaPagProvider
const FormaPagContext = createContext();

// Hook personalizado para acessar o contexto do FormaPagProvider
export function useFormaPag() {
  return useContext(FormaPagContext);
}

// Componente FormaPagProvider
export function FormaPagProvider({ children }) {
  // Estado para armazenar a lista de formasPag
  const [formasPag, setformasPag] = useState([]);

  // Simule uma requisição à API para obter a lista de formasPag
  useEffect(() => {
    // Suponha que você faça uma solicitação à API aqui
    // Substitua este código pela lógica real de busca de formasPag
    const fetchformasPag = async () => {
      try {
        // Simula uma solicitação à API
        const response = await FormaPagActions.GetAll()
        const data = await response.json();
        // const data = []

        // Define a lista de formasPag com os dados da resposta da API
        setformasPag(data);
      } catch (error) {
        console.error('Erro ao buscar formasPag:', error);
      }
    };

    // Chame a função de busca de formasPag
    fetchformasPag();
  }, []); // Execute a busca apenas uma vez, quando o componente for montado

  return (
    <FormaPagContext.Provider value={{ formasPag }}>
      {children}
    </FormaPagContext.Provider>
  );
}

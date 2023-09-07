import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClienteActions } from '../actions/ClienteActions';

// Crie um contexto para o ClienteProvider
const ClienteContext = createContext();

// Hook personalizado para acessar o contexto do ClienteProvider
export function useCliente() {
  return useContext(ClienteContext);
}

// Componente ClienteProvider
export function ClienteProvider({ children }) {
  // Estado para armazenar a lista de clientes
  const [clientes, setClientes] = useState([]);

  // Simule uma requisição à API para obter a lista de clientes
  useEffect(() => {
    // Suponha que você faça uma solicitação à API aqui
    // Substitua este código pela lógica real de busca de clientes
    const fetchClientes = async () => {
      try {
        // Simula uma solicitação à API
        const response = await ClienteActions.GetAll()
        const data = await response.json();
        // const data = []

        // Define a lista de clientes com os dados da resposta da API
        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    // Chame a função de busca de clientes
    fetchClientes();
  }, []); // Execute a busca apenas uma vez, quando o componente for montado

  return (
    <ClienteContext.Provider value={{ clientes }}>
      {children}
    </ClienteContext.Provider>
  );
}

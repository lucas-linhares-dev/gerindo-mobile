import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClienteActions } from '../actions/ClienteActions';

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export function ClienteProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [reload, setReload] = useState(false)

  useEffect(() => {

    const fetchClientes = async () => {
      try {
        const response = await ClienteActions.GetAll()
        const data = await response.json();

        setClientes(data);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, [reload]); 

  return (
    <ClienteContext.Provider value={{ clientes, reload, setReload }}>
      {children}
    </ClienteContext.Provider>
  );
}

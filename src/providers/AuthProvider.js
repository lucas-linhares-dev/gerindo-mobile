// AuthContext.js
import { createContext, useContext, useState } from 'react';
import { UsuarioActions } from '../actions/UsuarioActions';
import { storeUser } from '../services/StorageUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (data)  => {
    console.log(data)
    const res = await UsuarioActions.Logar(data)
    if(res.status === 200){
        setIsAuthenticated(true);
    }
    else {
        setIsAuthenticated(false);
    }
    return res
  };

  const logout = async () => {
    await storeUser({})
    setIsAuthenticated(false);
    console.log(isAuthenticated)
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

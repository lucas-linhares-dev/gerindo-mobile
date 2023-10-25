// AuthContext.js
import { createContext, useContext, useState } from 'react';
import { UsuarioActions } from '../actions/UsuarioActions';
import { storeUser } from '../services/StorageUser';

const AuthContext = createContext();

export const AuthProvider = ({ children, navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState({})

  const login = async (data)  => {
    const res = await UsuarioActions.Logar(data)
    if(res.status === 200){
        const usuario = await res.json();
        setUsuario(usuario)
        setIsAuthenticated(true);
        console.log("LOGOU")
        return usuario
    }
    else {
        setIsAuthenticated(false);
        return 'ERRO'
    }
  };

  const logout = async () => {
    await storeUser({})
    setIsAuthenticated(false);
    console.log("DESLOGOU")
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

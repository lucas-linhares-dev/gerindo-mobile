const API_BASE_URL = "http://192.168.1.70:3001"
// const API_BASE_URL = "http://10.50.42.175:3001"



export const UsuarioActions = {
    Logar,
    Cadastrar
}

async function Logar(usuario) {
    try {
        const res = await fetch(`${API_BASE_URL}/auth/usuarios/mobile/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM LOGAR")
    }
}

async function Cadastrar(usuario) {
    try {
        const res = await fetch(`${API_BASE_URL}/cadastro/mobile/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(usuario),
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM CADASTRAR")
    }
}
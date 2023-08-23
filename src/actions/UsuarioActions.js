
const API_BASE_URL = "http://192.168.1.69:3001"

export const UsuarioActions = {
    Logar,
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
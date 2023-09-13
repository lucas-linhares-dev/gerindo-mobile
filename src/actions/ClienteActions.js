//const API_BASE_URL = "http://192.168.1.69:3001" // DESKTOP HOME

const API_BASE_URL = "http://10.50.42.98:3001" // NOTBOOK UNIFOR

// const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

export const ClienteActions = {
    GetAll,
}

async function GetAll() {
    try {
        const res = await fetch(`${API_BASE_URL}/clientes/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM")
    }
}


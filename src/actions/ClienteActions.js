// const API_BASE_URL = "http://192.168.1.69:3001" // DESKTOP HOME

// const API_BASE_URL = "http://10.50.40.107:3001" // NOTBOOK UNIFOR

const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

export const ClienteActions = {
    GetAll,
    Insert
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

async function Insert(objInsert) {
    console.log(objInsert)
    try {
        const res = await fetch(`${API_BASE_URL}/cliente/insert`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(objInsert), // Envia o objeto no corpo da solicitação
        });
        return res;
        console.log(res)
    } catch (error) {
        console.log("DEU RUIM")
    }
}


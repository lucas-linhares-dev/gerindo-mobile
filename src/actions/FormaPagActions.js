//const API_BASE_URL = "http://192.168.1.69:3001"
const API_BASE_URL = "http://10.50.42.98:3001"



export const FormaPagActions = {
    GetAll,
}

async function GetAll() {
    try {
        console.log("AAAAAAAAAAAAAAAAA")
        const res = await fetch(`${API_BASE_URL}/formaspag/`, {
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


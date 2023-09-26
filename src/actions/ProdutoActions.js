const API_BASE_URL = "http://192.168.1.69:3001"
// const API_BASE_URL = "http://10.50.42.175:3001"

export const ProdutoActions = {
    GetWithCode,
}

async function GetWithCode(codigo) {
    console.log(codigo)
    try {
        const res = await fetch(`${API_BASE_URL}/produto/getWithCode/${codigo}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM", error);
    }
}



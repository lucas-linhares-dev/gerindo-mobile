//const API_BASE_URL = "http://192.168.1.69:3001" // DESKTOP HOME

const API_BASE_URL = "http://10.50.40.107:3001" // NOTBOOK UNIFOR

// const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

import axios from 'axios'

export const VendaActions = {
    Insert,
}

async function Insert(objInsert) {
    try {
        const res = await axios.post(`${API_BASE_URL}/vendas`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: objInsert, // Envia o objeto no corpo da solicitação
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM")
    }
}


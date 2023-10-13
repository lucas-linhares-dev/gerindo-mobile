// const API_BASE_URL = "http://192.168.1.69:3001" // DESKTOP HOME

// const API_BASE_URL = "http://10.50.46.113:3001" // NOTBOOK UNIFOR

const API_BASE_URL = "http://192.168.1.70:3001" // NOTBOOK HOME

import axios from 'axios'

export const VendaActions = {
    Insert,
    Update,
    Delete
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

async function Update(objUpdate) {
    console.log(objUpdate)
    try {
        const res = await axios.post(`${API_BASE_URL}/venda/update`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: objUpdate, // Envia o objeto no corpo da solicitação
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM")
    }
}

async function Delete(id) {
    console.log(id)
    try {
        const res = await axios.delete(`${API_BASE_URL}/venda/delete/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
        });
        return res;
    } catch (error) {
        console.log("DEU RUIM")
    }
}

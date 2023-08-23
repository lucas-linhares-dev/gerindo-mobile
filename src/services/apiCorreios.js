
import axios from 'axios'

export const apiCorreios = axios.create({
    baseURL: "https://viacep.com.br/ws/"
})


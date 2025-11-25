import axios from "axios"

export const validateUser = async () => {
    const token = axios.post('/api/auth')
    console.log(token)
}
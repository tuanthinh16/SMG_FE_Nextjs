import axios from 'axios';
import { URL_BASE, URL_PORT } from '../config';

export const onLogin = async (username: string, password: string) => {
    const url = `http://${URL_BASE}:${URL_PORT}/auth/login`;
    try {
        const response = await axios.post(url, {
            username,
            password
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            // Handle successful login
            //console.log('Login successful:', response.data);
            return response.data;
        } else {
            // Handle login error
            console.error('Login failed:', response.status, response.statusText);
            return null;
        }
    } catch (error) {
        // Handle request error
        console.error('Login error:', error);
        return null;
    }
};
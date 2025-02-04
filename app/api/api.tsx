import axios from "axios";
import { URL_BASE, URL_PORT } from "../config";

class Api {
    private baseUrl: string;

    constructor() {
        this.baseUrl = `http://${URL_BASE}:${URL_PORT}/api/v1/`;
    }

    private async request(query: string, variables: Record<string, unknown> = {}, token?: string) {

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await axios.post(this.baseUrl, {
            query,
            variables,
        }, {
            headers,
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = response.data;
        if (result.errors) {
            throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
        }

        return result.data;
    }

    public async query(query: string, variables: Record<string, unknown> = {}) {
        return this.request(query, variables);
    }

    public async mutate(mutation: string, variables: Record<string, unknown> = {}, token?: string) {
        return this.request(mutation, variables, token);
    }
}

export default Api;
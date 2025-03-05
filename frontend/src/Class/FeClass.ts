import {User} from "../Types/types";

export class FeClass {
    private apiUrl: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";
    }


    async createUser(user: User) : Promise<User> {

        try {
            const newAddedUser = await fetch(`${this.apiUrl}/users`, {
                method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify(user)
            });

            if (!newAddedUser) {
                throw new Error(`HTTP ERROR: ${newAddedUser}`);
            }

            return await newAddedUser.json();

        }

        catch (error) {
            console.error(error);
            throw error;
        }

    }

    async getGoldPrice(currency: string) {

        try {

            const response = await fetch(`${this.apiUrl}/goldprice/${currency}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            return await response.json();

        }

        catch (error) {
            console.error("Unable to get gold price", error);
            throw error;
        }



    }

    async getSignal() {

        try {
            const response = await fetch(`${this.apiUrl}/signals`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        }

        catch (error) {
            console.error("Unable to get signal", error);
            throw error;
        }
    }
}

export const feClass = new FeClass();
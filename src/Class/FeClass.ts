import {User} from "../Types/types..ts";

export class FeClass {



    async createUser(user: User) : Promise<User> {

        try {
            const newAddedUser = await fetch("http://localhost:8080/users", {
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

            const response = await fetch(`http://localhost:8080/goldprice/${currency}`);

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
}

export const feClass = new FeClass();
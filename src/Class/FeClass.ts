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
}

export const feClass = new FeClass();
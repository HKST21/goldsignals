import {User} from "../Types/types..ts";

export class FeClass {



    async createUser(user: User) {

        try {
            const newAddedUser = await fetch("http://localhost:8080", {
                method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                body: JSON.stringify(user)
            });

            return await newAddedUser.json();

        }

        catch (error) {
            console.log(error);
        }

    }
}

export const feClass = new FeClass();
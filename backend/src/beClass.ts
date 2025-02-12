import {User} from "./betypes.";

export class beClass {
    private users: User[];

    constructor() {
        this.users = [];
    }


    async registerUser(user: User) {

        try {
            this.users.push(user);

            return user

        } catch (error) {
            console.log(error);
        }


    }
}

export const GoldbeClass = new beClass();

export default GoldbeClass;
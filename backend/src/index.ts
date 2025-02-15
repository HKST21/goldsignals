import express from "express";
import cors from "cors";
import {User} from "./betypes.";
import GoldbeClass from "./beClass";


const app = express();
const port = 8080;

app.use(cors()); // middleware setup
app.use(express.json());




app.post("/users", async (req, res) => {
    try {
        const user: User = req.body;

        if (user) {

            const response = await GoldbeClass.registerUser(user);

            if (!response) {
                console.error("failed to register user in backend")
            }

            res.json(response);
        }

    }

    catch (error) {

        console.log(error);

    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
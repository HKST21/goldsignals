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

app.get("/goldprice/:currency", async (req, res) => {

    const { currency } = req.params;
    try {

        const actualPrice = await GoldbeClass.getGoldPrice(currency);

        if (!actualPrice) {
            console.error("failed to getGold price");
        }

        res.json(actualPrice);

    }

    catch (error) {
        console.log(error);

    }
})

app.get("/signals", async (_req, res) => {
    try {
        const response = await GoldbeClass.getAllSignals();

        res.json(response);

        return


    }

    catch (error) {
        console.error("failed to getTestSignal", error);

        res.status(500).json({error: "failed to get signal"});

        return
    }
})

app.post("/analyze-message", async (req, res) => {

    const {text, timestamp} = req.body;
    console.log("endpoint data", text, timestamp);

    try {
        const response = await GoldbeClass.createSignal(text, timestamp);

        res.json(response);
    }

    catch (error) {
        console.error('failed to send text signal to backend', error);
    }
})


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
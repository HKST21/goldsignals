import express from "express";
import cors from "cors";
import {User} from "./betypes.";
import {Request, Response} from "express";
import GoldbeClass from "./beClass";
import {Api} from "telegram";
import ReqPq = Api.ReqPq;


const app = express();
const port = process.env.PORT || 8080;

app.use(cors({
    origin: [
        'http://localhost:5173',                // Lokální vývoj (Vite výchozí port)
        'https://hkst21.github.io'              // Tvá GitHub Pages doména
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());




app.post("/users", async (req : Request, res: Response) => {
    try {
        const user: User = (req.body as unknown) as User;

        if (user) {

            const response = await GoldbeClass.registerUser(user);

            if (!response) {
                console.error("failed to register user in backend")
            }

            (res as any).json(response);
        }

    }

    catch (error) {

        console.log(error);

    }
})

app.get("/goldprice/:currency", async (req: Request, res: Response) => {

    const currency = (req as any).params.currency;

    console.log("requested currency", currency);

    try {

        const actualPrice = await GoldbeClass.getGoldPriceFromDb();

        if (!actualPrice) {
            console.error("failed to getGold price");
        }

        (res as any).json(actualPrice);

    }

    catch (error) {
        console.log(error);

    }
})

app.get("/signals", async (_req: Request, res: Response) => {
    try {
        const response = await GoldbeClass.getAllSignals();

        (res as any).json(response);

        return


    }

    catch (error) {
        console.error("failed to getTestSignal", error);

        (res as any).status(500).json({error: "failed to get signal"});

        return
    }
})

app.post("/analyze-message", async (req: Request, res: Response) => {

    const {text, timestamp} = (req.body as unknown) as {text: string, timestamp: string};
    console.log("endpoint data", text, timestamp);

    try {
        const response = await GoldbeClass.createSignal(text, timestamp);

        (res as any).json(response);
    }

    catch (error) {
        console.error('failed to send text signal to backend', error);
    }
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    GoldbeClass.startGoldPriceUpdates(30000000);
});
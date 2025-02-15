import * as React from "react";
import {useState} from "react";
import {feClass} from "../Class/FeClass.ts";
import {SectionPick} from "../App.tsx";


interface User {
    id?: number;
    email: string,
    phone: string,
    password: string
}

interface SectionProps {
    setCurrentSection: React.Dispatch<React.SetStateAction<SectionPick>>
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>
}

export function RegSection({setCurrentSection, setLoggedUser}: SectionProps) {

    const [registerForm, setRegisterForm] = useState(false);
    const [newUser, setNewUser] = useState<User>({
        email: "",
        phone: "",
        password: "",
    });


    const handleRegister = (e: React.ChangeEvent<HTMLInputElement>) => {

        const {name, value} = e.target;

        setNewUser({
            ...newUser,
            [name]: value,

        })


    }

    const handleSubmitRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        feClass.createUser(newUser).then((response) => {

            setLoggedUser(response);
            setCurrentSection("signals")


        }).catch((error) => {
            console.log("User wasnt created", error);
        })
    }


    return (
        <div>
            <p>
                Struggling with your prop or live trading account? We are here to help you beat the market and MAKE
                MONEY on the market.
                We are experts in GOLD trading. Become member and receive 3 VIP XAUUSD signals a day created by gold
                trading masters and AI analysis.
                We analyse GOLD so you can trade. Join us NOW and get your first GOLD signals for FREE.
            </p>

            {registerForm ? (
                <div>
                    <p>
                        WELCOME TO GOLDSIGNALS REGISTER NOW FOR FREE
                    </p>
                    <form onSubmit={handleSubmitRegister}>
                        <input
                            type="text"
                            name="email"
                            placeholder="Email"
                            value={newUser.email}
                            onChange={handleRegister}
                            required={true}/>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone number"
                            value={newUser.phone}
                            onChange={handleRegister}
                            required={true}/>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={handleRegister}
                            required={true}/>

                        <button type="submit">REGISTER</button>
                    </form>
                </div>
            ) : (
                <div>

                    Why Become a Member?
                    <ul>
                        <li>Receive daily alerts via our IOS and ANDROID APP</li>
                        <li>User-friendly. No previous experience needed</li>
                        <li>Follow proven strategies over the years</li>
                        <li>Learn from experts with a proven track record (93.45% Success Rate)</li>
                    </ul>

                </div>)}

            {!registerForm && <button onClick={() => setRegisterForm(true)}>JOIN NOW FOR FREE</button>}


        </div>
    );
};


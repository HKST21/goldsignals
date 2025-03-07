import * as React from "react";
import {useState} from "react";
import {feClass} from "../Class/FeClass";
import {SectionPick} from "../App";
import "./RegSection.css"
import {SquareCheckBig} from 'lucide-react'


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
        <div className={"main-section"}>
            <div className="info-section">
                <h2>
                    We <span>analyse</span> the GOLD market so you can trade. Elevate your winning trades on XAUUSD!
                </h2>
                <p>
                    We are here to help you <span>beat</span> the market. Are you struggling with your trading account ? We believe in mastering one asset, than focuse on everything at once.
                    <span> OUR APP is expertized in GOLD trading</span>. Become member and receive <span>2 VIP XAUUSD</span> signals a day. Do you want proofs? Our service is FREE for 7 days, check our results and become member🙌
                    .

                </p>
            </div>
            <div className={'conditional-section'}>
                {registerForm ? (
                    <div>
                        <div>
                            WELCOME TO GOLDSIGNALS REGISTER NOW FOR FREE
                        </div>
                        <form className={"form-container"} onSubmit={handleSubmitRegister}>
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
                            <li><SquareCheckBig/>Receive daily alerts via our IOS and ANDROID APP</li>
                            <li><SquareCheckBig/>User-friendly. No previous experience needed</li>
                            <li><SquareCheckBig/>Follow proven strategies over the years</li>
                            <li><SquareCheckBig/>Learn from experts with a proven track record (93.45% Success Rate)</li>
                        </ul>


                    </div>)}

                {!registerForm && <button onClick={() => setRegisterForm(true)}>JOIN NOW FOR FREE</button>}

            </div>
        </div>

    );
};


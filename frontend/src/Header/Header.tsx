import "./Header.css"
import {User} from "../Types/types";
import React from "react";
import {SectionPick} from "../App";

interface HeaderProps {
    loggedUser: User | null,
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>,
    setCurrentSection : React.Dispatch<React.SetStateAction<SectionPick>>
}

export function Header({loggedUser, setLoggedUser, setCurrentSection} : HeaderProps) {


    const handleLogout = () => {
        setLoggedUser(null);
        setCurrentSection('register');
        console.log("chci se logoutnout")
    }


    return (
        <div className={"Header"}>
            {loggedUser ? (
                <div className={"logged"}>
                    👋 {loggedUser.email}
                </div>
            ) : (
                <button>LOGIN</button>
            )}

            <div>
                <img className={"img"} src={import.meta.env.BASE_URL + "logo2.png"}/>
            </div>
            {loggedUser ? (
                <button  onClick={handleLogout}>LOG OUT</button>
            ) : (
                <button>REGISTER</button>
            )}

        </div>
    );
};


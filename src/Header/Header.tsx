import "./Header.css"
import {User} from "../Types/types..ts";
import React from "react";
import {SectionPick} from "../App.tsx";

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
                <div>
                    Hello {loggedUser.email}
                </div>
            ) : (
                <button>LOGIN</button>
            )}

            <div>
                <img className={"img"} src={"./public/logo.png"}/>
            </div>
            {loggedUser ? (
                <button  onClick={handleLogout}>LOG OUT</button>
            ) : (
                <button>REGISTER</button>
            )}

        </div>
    );
};


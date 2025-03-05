import React from 'react';
import {Header} from "../Header/Header.tsx";
import {Footer} from "../Footer/Footer.tsx";
import "./Layout.css"
import {User} from "../Types/types.ts";
import {SectionPick} from "../App.tsx";

interface LayoutProps {
    children: React.ReactNode;
    loggedUser: User | null,
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>
    setCurrentSection : React.Dispatch<React.SetStateAction<SectionPick>>
}

export function Layout({children, loggedUser, setLoggedUser, setCurrentSection}: LayoutProps) {


    return (
        <div>
            <Header loggedUser={loggedUser} setLoggedUser={setLoggedUser} setCurrentSection={setCurrentSection} />
            <div>
                {children}
            </div>
            <Footer/>
        </div>
    );
};


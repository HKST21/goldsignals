import React from 'react';
import {Header} from "../Header/Header";
import {Footer} from "../Footer/Footer";
import "./Layout.css"
import {User} from "../Types/types";
import {SectionPick} from "../App";
import AdServer from "../AdServer/AdServer";

interface LayoutProps {
    children: React.ReactNode;
    loggedUser: User | null,
    setLoggedUser: React.Dispatch<React.SetStateAction<User | null>>
    setCurrentSection : React.Dispatch<React.SetStateAction<SectionPick>>
}

export function Layout({children, loggedUser, setLoggedUser, setCurrentSection}: LayoutProps) {
    return (
        <div className="Layout">
            <div className="header-area">
                <Header loggedUser={loggedUser} setLoggedUser={setLoggedUser} setCurrentSection={setCurrentSection} />
            </div>

            <div className="content-area">
                {children}
            </div>

            <div className="sidebar-area">
                <AdServer />
            </div>

            <div className="footer-area">
                <Footer />
            </div>
        </div>
    );
};
import {useState} from "react";
import './App.css'
import {Layout} from "./Layout/Layout.tsx";
import {RegSection} from "./RegSection/RegSection.tsx";
import {Reviews} from "./Reviews/Reviews.tsx";
import {User} from "./Types/types..ts";
import {Signals} from "./Signals/Signals.tsx";


export type SectionPick = 'register' | 'signals';


function App() {

    const [currentSection, setCurrentSection] = useState<SectionPick>('register');
    const [loggedUser, setLoggedUser] = useState<User | null>(null);


    return (
        <>
            <Layout loggedUser={loggedUser} setLoggedUser={setLoggedUser} setCurrentSection={setCurrentSection}>
                {currentSection === 'register' && (
                    <div>
                        <RegSection setCurrentSection={setCurrentSection} setLoggedUser={setLoggedUser} />
                        <Reviews/>
                    </div>
                )}
                {currentSection === 'signals' && (
                    <Signals loggedUser={loggedUser} />
                )}
            </Layout>
        </>
    )
}

export default App

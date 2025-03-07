import {useState} from "react";
import './App.css'
import {Layout} from "./Layout/Layout";
import {RegSection} from "./RegSection/RegSection";
import {Reviews} from "./Reviews/Reviews";
import {User} from "./Types/types";
import {Signals} from "./Signals/Signals";


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

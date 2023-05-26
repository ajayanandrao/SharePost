import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "./firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentuser, setCurrentUser] = useState();
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const uid = user.uid;
<<<<<<< HEAD

=======
               
>>>>>>> de4cc00f3462f5e042bd3a1556cba3692eb502a0
            } else {

            }
        });
        return () => {
            unsub();
        };
    }, [])

    return (<AuthContext.Provider value={{ currentuser }}>{children}</AuthContext.Provider>)
};

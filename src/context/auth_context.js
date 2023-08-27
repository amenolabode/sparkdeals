// import { createContext } from "react";
// import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// const UserContext = createContext()

// export const AuthContextProvider = ({ children }) => {
//     return (<UserContext.Provider value={children}>{children}</UserContext.Provider>)
// }

// export const UserAuth = () => {
//     return UserContext(UserContext)
// }

import React, { createContext, useEffect, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../utils/firebase_config";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("")

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signIn = async (email, password) => {

        try {
            await signInWithEmailAndPassword(auth, email, password);


        } catch (error) {
            setError(error)
        }
    };

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCredential.user);
        } catch (error) {

        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            setError(error)
        }
    };

    const contextValue = {
        user,
        error,
        signIn,
        signUp,
        signOut: signOutUser,
    };

    return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

export const useAuth = () => {
    return React.useContext(UserContext);
};

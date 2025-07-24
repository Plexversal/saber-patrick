'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import { LoremIpsum } from 'lorem-ipsum';


const lorem = new LoremIpsum({
    sentencesPerParagraph: { max: 8, min: 4 },
    wordsPerSentence: { max: 16, min: 4 },
});

export interface IRegexContext {
    regexPatterns: IRegexEntry[];
    setRegexPatterns: Dispatch<SetStateAction<IRegexEntry[]>>;
    userText: string;
    setUserText: Dispatch<SetStateAction<string>>;
    regexInputValue: string;
    setRegexInputValue: Dispatch<SetStateAction<string>>;
    addRegex: (e: React.FormEvent<HTMLFormElement>) => void
    deleteRegex: (e: number) => void
}

interface IRegexEntry {
    pattern: string;
    approved: boolean;
}
const RegexContext = createContext<IRegexContext | null>(null);

export function RegexProvider({children}: {children: ReactNode}) {
    const [regexPatterns, setRegexPatterns] = useState<IRegexEntry[]>([])
    const [userText, setUserText] = useState<string>(lorem.generateParagraphs(7))
    const [regexInputValue, setRegexInputValue] = useState('')


    /* Initialize the local storage patterns */
    useEffect(() => {
        let regexPatterns = localStorage.getItem("regexPatterns")
        if (regexPatterns) {
            return setRegexPatterns(JSON.parse(regexPatterns))
        }
    }, []);

    function addRegex(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if(!regexInputValue) return

        const entry = {
            pattern: regexInputValue,
            approved: false
        }
        const updatedPatterns = [...regexPatterns, entry];

        setRegexPatterns(updatedPatterns)
        setRegexInputValue('')
        
        localStorage.setItem('regexPatterns', JSON.stringify(updatedPatterns))
    }

    function deleteRegex(index: number) {
        const updatedPatterns = [...regexPatterns];
        updatedPatterns.splice(index, 1);

        setRegexPatterns(updatedPatterns);
        localStorage.setItem('regexPatterns', JSON.stringify(updatedPatterns));
    }

    return (<RegexContext.Provider
    value={{
        regexPatterns,
        setRegexPatterns,
        userText,
        setUserText,
        regexInputValue,
        setRegexInputValue,
        addRegex,
        deleteRegex
    }}>
        {children}
    </RegexContext.Provider>)
}

export function useRegexContext() {
    const context = useContext(RegexContext);
    if (!context) throw new Error("useRegexContext must be used within RegexProvider");
    return context;
}
'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode, SetStateAction, Dispatch, useRef } from 'react';
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
    deleteRegex: (index: number) => void;
    editRegex: (index: number, pattern: string) => void;
    approveRegex: (index: number, approvalStatus: boolean) => void;
    workerMatches: string[];
    setWorkerMatches: Dispatch<SetStateAction<string[]>>;
    runExtraction: (pattern: string, text: string) => void;
    currentSelectedIndex: number;
    setCurrentSelectedIndex: Dispatch<SetStateAction<number>>
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
    const [workerMatches, setWorkerMatches] = useState<string[]>([]);
    const [currentSelectedIndex, setCurrentSelectedIndex] = useState<number>(0)
    const workerRef = useRef<Worker | null>(null);

    /* Initialize the local storage patterns and worker */
    useEffect(() => {
        let regexPatterns = localStorage.getItem("regexPatterns")
        if (regexPatterns) {
            setRegexPatterns(JSON.parse(regexPatterns))
        }
        const worker = new Worker(
            new URL('@/workers/regexExtraction.worker.ts', import.meta.url),
            { type: 'module' }
        );
        workerRef.current = worker;
        
        worker.onmessage = (event) => {
            const { matches, error } = event.data;
            if (error) {
                console.error(error);
                setWorkerMatches([]);
            } else {
                console.log('Matches:', matches);
                setWorkerMatches(matches)
            }
        };
        return () => {
            worker.terminate();
            workerRef.current = null;
        };

    }, []);

    useEffect(() => {
        if(!regexPatterns || !regexPatterns[currentSelectedIndex]?.pattern || !userText) return;
        runExtraction(regexPatterns[currentSelectedIndex].pattern, userText)
    }, [userText, currentSelectedIndex, regexPatterns])

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

    function editRegex(index: number, newPattern: string) {
        const updatedEntry = {
            pattern: newPattern,
            approved: false
        }

        const updatedPatterns = [...regexPatterns];
        updatedPatterns[index] = updatedEntry;

        setRegexPatterns(updatedPatterns);
        localStorage.setItem('regexPatterns', JSON.stringify(updatedPatterns));
    }

    function approveRegex(index: number, approvalStatus: boolean) {
        const updatedEntry = {
            pattern: regexPatterns[index].pattern,
            approved: approvalStatus
        }

        const updatedPatterns = [...regexPatterns];
        updatedPatterns[index] = updatedEntry;

        setRegexPatterns(updatedPatterns);
        localStorage.setItem('regexPatterns', JSON.stringify(updatedPatterns));
    }

    function runExtraction(pattern: string, text: string) {
        if (workerRef.current) {
            workerRef.current.postMessage({ pattern, text });
        }
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
        deleteRegex,
        editRegex,
        approveRegex,
        workerMatches,
        setWorkerMatches,
        runExtraction,
        currentSelectedIndex,
        setCurrentSelectedIndex
    }}>
        {children}
    </RegexContext.Provider>)
}

export function useRegexContext() {
    const context = useContext(RegexContext);
    if (!context) throw new Error("useRegexContext must be used within RegexProvider");
    return context;
}
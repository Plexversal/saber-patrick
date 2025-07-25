'use client'

import styles from '@/styles/mainSection.module.css'
import { LoremIpsum } from "lorem-ipsum";
import React, { useState } from 'react';
import { useRegexContext } from '@/context/RegexContext';


const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    },
})

export default function MainSection() {

    const {userText, setUserText, workerMatches} = useRegexContext()

    const inputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserText(e.target.value);
    };

    function countInstances(matches: string[]) {
        if(matches.length == 0) return;
        if(matches.includes('No matches found')) return <div>No matches found</div>;
        let count: Record<string, number> = matches.reduce((cnt: any, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
        return < >
            
            {
                Object.entries(count).map(([key, val]) => (
                <div className={styles['matched-term-wrapper']} key={key}>Matched term: <span className={styles['matched-term']}>{key}</span> has <span>{val}</span> matches</div>
                ))
            }
        </>
    }

    return (
        <div className={styles['main-container']}>
            <div className={styles['textarea-wrapper']}>
            <textarea
                spellCheck={false}
                className={styles['text-area']}
                onChange={inputOnChange}
                value={userText}/>
                
            <button onClick={() => setUserText(lorem.generateParagraphs(7))}>Generate Text</button>
            </div>
            <div className={styles['results-container']}>
            <h2>Results</h2>
            {countInstances(workerMatches)}
            </div>

        </div>
    )
}
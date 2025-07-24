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

    const {userText, setUserText} = useRegexContext()

    const inputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setUserText(e.target.value);
    };

    return (
        <div className={styles['main-container']}>
            <textarea
                className={styles['your-textarea-class']}
                onChange={inputOnChange}
                value={userText}/>
                
            <button onClick={() => setUserText(lorem.generateParagraphs(7))}>Generate Text</button>
        </div>
    )
}
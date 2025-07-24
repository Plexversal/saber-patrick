'use client'

import styles from '@/styles/mainSection.module.css'
import { LoremIpsum } from "lorem-ipsum";
import React, { useState } from 'react';


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

    const [currentText, setCurrentText] = useState<string>(lorem.generateParagraphs(7))

    const inputOnChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCurrentText(e.target.value);
    };

    return (
        <div className={styles['main-container']}>
            <textarea
                className={styles['your-textarea-class']}
                onChange={inputOnChange}
                value={currentText}/>
                
            <button onClick={() => setCurrentText(lorem.generateParagraphs(7))}>Generate Text</button>
        </div>
    )
}
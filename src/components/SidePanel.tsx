'use client'

import React, { useState, useEffect } from 'react';


export default function SidePanel() {

    const [regexPatterns, setRegexPatterns] = useState<string[]>([])
    const [inputValue, setInputValue] = useState('')


    /* Initialize the local storage patterns */
    useEffect(() => {
        let regexPatterns = localStorage.getItem("regexPatterns")
        if (regexPatterns) {
            return setRegexPatterns(JSON.parse(regexPatterns))
        }
    }, []);


    function addRegex(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if(!inputValue) return

        const updatedPatterns = [...regexPatterns, inputValue];

        setRegexPatterns(updatedPatterns)
        setInputValue('')
        
        localStorage.setItem('regexPatterns', JSON.stringify(updatedPatterns))
    }


    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setInputValue(e.target.value)
    }
    return (
        <div>
            <div>Toggle</div>
            
            <div>
                <p>edit mode</p>
                <form onSubmit={(e) => addRegex(e)}>
                    <button type='submit'>Add Pattern</button>
                    <input onChange={e => onChange(e)} type='text' placeholder='type your pattern'></input>
                </form>
                <h1>Current strings</h1>
                <ul>
                    {regexPatterns.map((e, i) => (
                        <li key={i}>{e}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
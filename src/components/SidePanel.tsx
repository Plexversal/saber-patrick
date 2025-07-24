'use client'

import React, { useState, useEffect } from 'react';
import { useRegexContext } from '@/context/RegexContext';

export default function SidePanel() {

    const {regexPatterns, setRegexPatterns, regexInputValue, setRegexInputValue, addRegex, deleteRegex, editRegex} = useRegexContext()
    const [editing, setEditing] = useState<number | null>(null)
    const [newPattern, setNewPattern] = useState('')

    /* Initialize the local storage patterns */
    useEffect(() => {
        let regexPatterns = localStorage.getItem("regexPatterns")
        if (regexPatterns) {
            return setRegexPatterns(JSON.parse(regexPatterns))
        }
    }, []);


    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        setRegexInputValue(e.target.value)
    }
    return (
        <div>
            <div>Toggle</div>
            
            <div>
                <p>edit mode</p>
                <form onSubmit={(e) => addRegex(e)}>
                    <button type='submit'>Add Pattern</button>
                    <input value={regexInputValue} onChange={e => onChange(e)} type='text' placeholder='type your pattern'></input>
                </form>
                <h1>Current strings</h1>
                <ul>
                    {regexPatterns.map((e, i) => (
                        <li key={i}>
                            {
                                editing === i ? <input value={newPattern} onChange={e => setNewPattern(e.target.value)}></input> :
                                <div>{e.pattern}</div>
                            } &gt; {e.approved ? 'approved' : 'not approved'} 
                            <button onClick={() => deleteRegex(i)}>Delete</button>
                            
                            {editing !== i ? 
                            <button onClick={() => {setEditing(i); setNewPattern(e.pattern)}}>edit</button> : 
                            <button onClick={() => {setEditing(null); editRegex(i, newPattern)}}>save</button>}

                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
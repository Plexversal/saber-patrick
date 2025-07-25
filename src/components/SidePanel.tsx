'use client'

import React, { useState, useEffect } from 'react';
import { useRegexContext } from '@/context/RegexContext';
import { FaCircleCheck, FaCircleXmark  } from "react-icons/fa6";

export default function SidePanel() {

    const {regexPatterns, setRegexPatterns, regexInputValue, setRegexInputValue, addRegex, deleteRegex, editRegex, approveRegex, runExtraction, workerMatches, userText, currentSelectedIndex, setCurrentSelectedIndex} = useRegexContext()
    const [editing, setEditing] = useState<number | null>(null)
    const [newPattern, setNewPattern] = useState<string>('')
    const [approveModeChosen, setApproveModeChosen] = useState<boolean>(true)
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

    useEffect(() => {
        console.log(workerMatches)
    }, [workerMatches])

    return (
        <div>
            <button onClick={() => approveModeChosen ? setApproveModeChosen(false) : setApproveModeChosen(true)}>Toggle Mode</button>
            
            <div>
                <p>{approveModeChosen ? 'Approve mode' : 'Edit mode'}</p>
                {
                    approveModeChosen ? 
                    <div>
                        <label htmlFor="regexSelect">Select a pattern:</label>
                            <select
                                id="regexSelect"
                                value={currentSelectedIndex}
                                onChange={(e) => setCurrentSelectedIndex(parseInt(e.target.value))}
                                >
                                {regexPatterns.map((e, i) => (
                                    <option key={i} value={i}>
                                    {e.pattern}
                                    </option>
                                ))}
                            </select>
                            {regexPatterns[currentSelectedIndex] && (
                            <div>
                                <h2>Status</h2>
                                {regexPatterns[currentSelectedIndex].approved ? (
                                <div>
                                    <div>Approved</div>
                                    <button onClick={() => approveRegex(currentSelectedIndex, false)}>Unapprove</button>
                                </div>

                                ) : (
                                <div>
                                    <div>Not Approved</div>
                                    <button onClick={() => approveRegex(currentSelectedIndex, true)}>Approve</button>
                                </div>

                                )}
                                <h3>extract</h3>
                                <button onClick={() => runExtraction(regexPatterns[currentSelectedIndex].pattern, userText)}>extract</button>
                            </div>
                            )}                            
                    </div> : 
                    <div>
                        <form onSubmit={(e) => addRegex(e)}>
                            <button type='submit'>Add Pattern</button>
                            <input value={regexInputValue} onChange={e => onChange(e)} type='text' placeholder='Type your pattern'></input>
                        </form>
                        <h1>Current Patterns</h1>
                        <ul>
                            {regexPatterns.map((e, i) => (
                                <li key={i}>
                                    {e.approved ? < FaCircleCheck /> : <FaCircleXmark />}
                                    {
                                        editing === i ? <input value={newPattern} onChange={e => setNewPattern(e.target.value)}></input> :
                                        <code>{e.pattern}</code>
                                    }
                                    <button onClick={() => deleteRegex(i)}>Delete</button>
                                    
                                    {editing !== i ? 
                                    <button onClick={() => {setEditing(i); setNewPattern(e.pattern)}}>edit</button> : 
                                    <button onClick={() => {setEditing(null); editRegex(i, newPattern)}}>save</button>}

                                </li>
                            ))}
                        </ul>
                    </div>
                }

            </div>
        </div>
    )
}
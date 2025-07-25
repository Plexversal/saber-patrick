'use client'

import React, { useState, useEffect } from 'react';
import { useRegexContext } from '@/context/RegexContext';
import { FaCircleCheck, FaCircleXmark, FaTrash, FaPen } from "react-icons/fa6";
import { FiSave } from "react-icons/fi";
import styles from '@/styles/sidePanel.module.css'

export default function SidePanel() {

    const {
        regexPatterns, 
        setRegexPatterns, 
        regexInputValue, 
        setRegexInputValue, 
        addRegex, 
        deleteRegex, 
        editRegex, 
        approveRegex, 
        workerMatches, 
        currentSelectedIndex, 
        setCurrentSelectedIndex } = useRegexContext()
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
        <div className={styles['side-panel-container']}>
            <h2>Patricks Masterpiece ©</h2>
            <div className={styles['mode-wrapper']}>
                <h3>{approveModeChosen ? 'Approve mode' : 'Edit mode'}</h3>
                <button onClick={() => approveModeChosen ? setApproveModeChosen(false) : setApproveModeChosen(true)}>Change Mode</button>
            </div>
            
            <div>
                {
                    approveModeChosen ? 
                    <div className={styles['select-pattern-wrapper']}>
                        <label htmlFor="regexSelect">Select a pattern</label>
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
                                {regexPatterns[currentSelectedIndex].approved ? (
                                
                                    <button className={styles['unapprove-btn']} onClick={() => approveRegex(currentSelectedIndex, false)}>Unapprove</button>
                                

                                ) : (
                                
                                
                                    <button className={styles['approve-btn']} onClick={() => approveRegex(currentSelectedIndex, true)}>Approve</button>
                                

                                )}
                            </div>
                            )}                            
                    </div> : 
                    <div>
                        <form className={styles['regex-input-form']} onSubmit={(e) => addRegex(e)}>
                            <input value={regexInputValue} onChange={e => onChange(e)} type='text' placeholder='Pattern (dont include surrounding //gi tags)'></input>
                            <button type='submit'>Add Pattern</button>
                        </form>
                        <h2>Current Patterns</h2>
                        <ul className={styles['pattern-list']}>
                            {regexPatterns.map((e, i) => (
                                <li  key={i}>
                                    <span className={styles['code-content-wrapper']}>
                                        {e.approved ? < FaCircleCheck /> : <FaCircleXmark />}
                                    {
                                        editing === i ? <input value={newPattern} onChange={e => setNewPattern(e.target.value)}></input> :
                                        <code><span>/</span>{e.pattern}<span>/gi</span></code>
                                    }
                                    </span>
                                    <span>
                                        {editing !== i ? 
                                    <button className={styles['edit-btn']} onClick={() => {setEditing(i); setNewPattern(e.pattern)}}><FaPen size={25} /></button> : 
                                    <button className={styles['save-btn']} onClick={() => {setEditing(null); editRegex(i, newPattern)}}><FiSave size={25}/></button>}
                                    <button className={styles['delete-btn']} onClick={() => deleteRegex(i)}><FaTrash size={25}/></button>
                                    </span>
                                    


                                </li>
                            ))}
                        </ul>
                    </div>
                }

            </div>
        </div>
    )
}
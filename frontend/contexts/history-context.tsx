import React, { useState, createContext, useContext } from 'react'
import { isNil } from 'ramda'
import { ISession } from '../../shared-types/email'

interface IFormResult {
    valid: boolean
    session: ISession
}

const HistoryStateContext = createContext()
const HistoryActionsContext = createContext()

function HistoryProvider(props) {
    const [formResult, setFormResult] = useState<IFormResult>({} as IFormResult)

    return (
        <HistoryStateContext.Provider value={formResult}>
            <HistoryActionsContext.Provider value={setFormResult}>
                {props.children}
            </HistoryActionsContext.Provider>
        </HistoryStateContext.Provider>
    )
}

const useHistoryState = () => {
    let context = useContext(HistoryStateContext)
    if (isNil(context)) throw new Error('useHistoryState must be used within a HistoryProvider')
    return context
}

const useHistoryActions = () => {
    const context =  useContext(HistoryActionsContext)
    if (isNil(context)) throw new Error('useHistoryActions must be used within a HistoryProvider')
    return context
}

export { HistoryProvider, useHistoryState, useHistoryActions }

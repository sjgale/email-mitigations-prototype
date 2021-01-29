import React, { useState, createContext, useContext } from 'react'
import { isNil } from 'ramda'

const FormStateContext = createContext()
const FormDispatchContext = createContext()

function FormProvider(props) {
    const [email, setEmail] = useState<string>('')

    const formActions = {
        setEmail
    }

    return (
        <FormStateContext.Provider value={{ formState: { email } }}>
            <FormDispatchContext.Provider
                value={{ formActions }}
            >
                {props.children}
            </FormDispatchContext.Provider>
        </FormStateContext.Provider>
    )
}

const useFormState = () => {
    const context = useContext(FormStateContext)
    if (isNil(context)) throw new Error('useFormState must be used within a formProvider')
    return context
}


const useFormActions = () => {
    const context = useContext(FormDispatchContext)
    if (isNil (context)) throw new Error('useFormActions must be used within a formProvider')
    return context
}

export { FormProvider, useFormState, useFormActions }

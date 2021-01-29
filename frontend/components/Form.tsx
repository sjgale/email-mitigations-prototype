import React, {useCallback} from 'react'
import { useFormState, useFormActions } from '../contexts/form-context'
import { useHistoryActions } from '../contexts/history-context'

const Form = (): React.FC => {
    const {formState} = useFormState()
    const {formActions} = useFormActions()
    const setFormResult = useHistoryActions()
    
    const onEmailInput = (event) => {
        formActions.setEmail(event.target.value)
    }

    const submitForm = useCallback(
        (e) => {
            e.preventDefault()
            fetch(`/email/${formState.email}`)
                .then((response) => response.json())
                .then((result) => {
                    if (result.success) {
                        setFormResult(result.data)
                    } else {
                        setFormResult({
                            flagged: true,
                            message: result.message
                        })
                    }
                })
        },
        [formState.email, setFormResult]
    )

    return (
        <form className="pure-form" onSubmit={submitForm}>
            <fieldset>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formState.email}
                    onInput={onEmailInput}
                />
                <button
                    type="submit"
                    className="pure-button pure-button-primary"
                >
                    Submit
                </button>
            </fieldset>
        </form>
    )
}

export default Form

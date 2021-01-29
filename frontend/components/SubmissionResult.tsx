import React from 'react'
import { useHistoryState } from '../contexts/history-context'

const SubmissionResult = () => {
    const { formResult } = useHistoryState()

    return formResult ? (
        <div>{`${formResult.flagged ? 'Valid attempt' : 'Invalid att'} - ${
            formResult.message
        }`}</div>
    ) : (
        ''
    )
}

export default SubmissionResult

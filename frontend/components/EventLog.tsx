import React from 'react'
import { useHistoryState } from '../contexts/history-context'

const EventLog = () => {
    const formResult = useHistoryState()

    const keys =
        parseInt(formResult?.attempts?.length) > 0
            ? Object.keys(formResult?.attempts[0])
            : []

    const attempts = formResult?.attempts || []

    return (
        <section>
            <h2>Most Recent Attempts</h2>
            <table className="pure-table">
                <thead>
                    <tr>
                        {keys.map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {attempts.map((attempt) => (
                        <tr key={attempt.time}>
                            {keys.map((key) => (
                                <td key={`${attempt.time}-${attempt[key]}`}>
                                    {attempt[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

export default EventLog

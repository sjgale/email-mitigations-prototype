import React from 'react'

export default function Layout(props) {
    return (
        <div>
            <h1>Email Scoring Prototype</h1>
            <main>
                {props.children}
            </main>
        </div>
    )
}
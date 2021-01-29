import * as React from 'react'
import Form from './Form'
import SubmissionResult from './SubmissionResult'
import EventLog from './EventLog'
import Layout from './Layout'
import { FormProvider } from '../contexts/form-context'
import { HistoryProvider } from '../contexts/history-context'

const App = (): React.FC => {
    return (
        <Layout>
            <FormProvider>
                <HistoryProvider>
                    <Form />
                    <SubmissionResult />
                    <hr style={topMargin} />
                    <EventLog />
                </HistoryProvider>
            </FormProvider>
        </Layout>
    )
}

const topMargin = {marginTop: 50}

export default App

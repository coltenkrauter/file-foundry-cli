import { v4 } from 'uuid'

let runId: string

export function getRunId() {
    // Let's create runId one time
    if (!runId) {
        runId = `run.id.${v4()}`
    }

    return runId
}
import { createActions, handleActions } from 'redux-actions'

export const actions = createActions({
    API_CLIENT: {
        SET: apiClient => apiClient,
    },
})

const defaultState = null

export const reducer = handleActions({
    API_CLIENT: {
        SET: (state, action) => action.payload,
    },
}, defaultState)

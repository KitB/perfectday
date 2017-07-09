import { createActions, handleActions } from 'redux-actions'

export const actions = createActions({
    ME: {
        LOAD: async apiClient => {
            const response = await apiClient.whoami()
            return response
        },
    },
})

const defaultState = {
    id: 0,
    worth: 0,
    user: {
        email: 'example@example.com',
    },
}

export const reducer = handleActions({
    ME: {
        LOAD: (state, action) => action.payload,
    },
}, defaultState)

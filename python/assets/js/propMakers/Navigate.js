import { goBack, replace, push } from 'redux-little-router'

export const GoBack = (state, dispatch) => ({
    goBack: () => dispatch(goBack()),
})

export const Replace = (state, dispatch) => ({
    replace: loc => dispatch(replace(loc)),
})

export const Push = (state, dispatch) => ({
    push: loc => dispatch(push(loc)),
})

import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { routerForBrowser } from 'redux-little-router'
import promiseMiddleware from 'redux-promise'

import { reducer, enhancer as ducksEnhancer } from './Ducks'

const routes = {
    '/home/': {
        title: 'Home',
    },
    '/habit/:id': {
        title: 'Habit detail: ',
        '/edit': {
            title: 'Editing habit: ',
        },
    },
}

const loggerMiddleware = () => next => action => {
    console.log(action)
    return next(action)
}

const { reducer: routeReducer, middleware: routeMiddleware, enhancer: routeEnhancer } = routerForBrowser({
    routes,
    basename: '/frontend',
})

const configureStore = () => {
    return createStore(
        combineReducers({ router: routeReducer, pd: reducer }),
        {},
        compose(routeEnhancer, applyMiddleware( routeMiddleware), ducksEnhancer, applyMiddleware(loggerMiddleware, promiseMiddleware))
    )
}

export default configureStore

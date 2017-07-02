import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import pdApp from './reducers'
import { routerForBrowser } from 'redux-little-router'

const routes = {
    '/home/': {
        title: 'Home',
    },
    '/habit/:id': {
        title: 'Habit detail: ',
    },
}

const { reducer, middleware, enhancer } = routerForBrowser({
    routes,
    basename: '/frontend',
})

const configureStore = () => {
    return createStore(
        combineReducers({ router: reducer, pd: pdApp }),
        compose(enhancer, applyMiddleware(middleware)),
    )
}

export default configureStore

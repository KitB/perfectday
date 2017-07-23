import { connect as rconnect } from 'react-redux'
const mapStateToProps = state => state
const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
})

export const compose = (...merges) => (stateProps, dispatchProps, ownProps) => {
    // When composing mergers, we include the outputs of the other mergers this
    // way we can e.g. have one produce the habit and a later one use this habit
    // when dispatching things.
    const out = {}
    for (let merge of merges) {
        Object.assign(out, merge(stateProps, dispatchProps, out, ownProps))
    }
    return out
}

export const connect = (mergeProps, options) => (
    rconnect(mapStateToProps, mapDispatchToProps,
        (stateProps, dispatchProps, ownProps) => mergeProps(stateProps, dispatchProps.dispatch, ownProps),
        options
    )
)

export default {
    compose: compose,
    connect: connect,
}

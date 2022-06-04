/**
 * Rules of hooks:
 * hooks must be called from React functions
 * hooks must be called from top level
 */

// TODO make it a React Component
let component = {
    hooks: [],
}

let hookIndex = 0
function getHook (index) {
    const hooks = component.hooks || (component.hooks = [])
    while (index >= hooks.length) hooks.push({})
    return hooks[index]
}

function useReducer (reducer, initState, initialize) {
    const hook = getHook(hookIndex++)
    if (!hook.reducer) hook.reducer = reducer

    // having `comp` indicates initialization done
    if (!hook.comp) {
        hook.comp = component
        const state = typeof initialize === 'function'
            ? initialize(initState)
            : typeof initState === 'function' ? initState() : initState
        const dispatch = (action) => {
            const next = hook.reducer(hook.state[0], action)
            if (next !== hook.state[0]) {
                hook.state = [next, hook.state[1]]
                hook.comp.setState({})
            }
        }
        hook.state = [state, dispatch]
    }
    return hook.state
}

// [state, setState(ns)]
function useState (initState) {
    return useReducer(
        (os, ns) => (typeof ns === 'function' ? ns(os) : ns),
        initState,
    )
}

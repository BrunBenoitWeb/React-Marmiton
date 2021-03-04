import {apiFetch} from "../utils/Api";
import {useCallback, useReducer} from "react";

function reducer(state, action) {
        switch (action.type) {
            case 'FETCHING_INGREDIENTS':
                return {...state, loading: true}
            case 'SET_INGREDIENTS':
                return {...state, ingredients: action.payload, loading: false}
            case 'DELETE_INGREDIENTS':
                return {...state, ingredients: state.ingredients.filter(i => i !== action.payload)}
            case 'ADD_INGREDIENTS':
                return {...state, ingredients: [ action.payload,...state.ingredients]}
            case 'UPDATE_INGREDIENTS':
                return {...state, ingredients: state.ingredients.map(i => i === action.target ? action.payload : i )}
            default:
                throw new Error('Action inconnue ' + action.type)
        }
}


export function useIngredients() {
    const [state, dispatch] = useReducer(reducer,{
        ingredients: null,
        loading: false
    })

    return{
        ingredients: state.ingredients,
        fetchIngredients:  useCallback(async function (){
            if (state.loading || state.ingredients){return }
            dispatch({type: 'FETCHING_INGREDIENTS'})
            const ingredients = await apiFetch('/ingredients')
            dispatch({type: 'SET_INGREDIENTS', payload: ingredients})
        }, [state]),
        deleteIngredient:  useCallback(async function(ingredient){
            await apiFetch('/ingredients/' + ingredient.id, {
                method: 'DELETE'
            })
            dispatch({type: 'DELETE_INGREDIENTS', payload: ingredient})
        }, []),
        updateIngredient:  useCallback(async function(ingredient, data){
            const newIngredient = await apiFetch('/ingredients/' + ingredient.id,{
                method: 'PUT',
                body: data
            })
            dispatch({type: 'UPDATE_INGREDIENTS', payload: newIngredient, target: ingredient})
        }, []),
        createIngredient: useCallback( async function(data){
            const newIngredient = await apiFetch('/ingredients/',{
                method: 'POST',
                body: data
            })
            dispatch({type: 'ADD_INGREDIENTS', payload: newIngredient})
        }, [])
    }
}
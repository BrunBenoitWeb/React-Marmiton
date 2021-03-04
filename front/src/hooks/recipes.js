import {useCallback, useReducer} from "react";
import {apiFetch} from "../utils/Api";


function reducer(state, action) {

    switch (action.type) {
        case 'FETCHING_RECIPES':
            return {...state, loading: true}
        case 'SET_RECIPES':
            return {...state, loading: false, recipes: action.payload}
        case 'FETCHING_RECIPE':
            return {...state, recipeId: action.payload.id}
        case 'DESELECT_RECIPE':
            return {...state, recipeId: null}
        case 'ADD_RECIPES':
            return {...state, recipes: [action.payload, ...state.recipes]}
        case 'DELETE_RECIPES':
            return {...state, recipes: state.recipes.filter(i => i !== action.payload)}
        case 'SET_RECIPE':
            return {
                ...state,
                recipes: state.recipes.map(r => r.id === action.payload.id ? action.payload : r)
            }
        default:
            throw new Error('Action inconnue ' + action.type)
    }
}

export function useRecipes() {
    const [state, dispatch] = useReducer(reducer, {
        loading: false,
        recipes: null,
        recipeId: null
    })

    const recipe = state.recipes ? state.recipes.find(r => r.id === state.recipeId) : null

    return {
        recipes: state.recipes,
        recipe: recipe,
        fetchRecipes: async function () {
            if (state.loading || state.recipes !== null) {
                return null
            }
            dispatch({type: 'FETCHING_RECIPES'})
            const recipes = await apiFetch('/recipes')
            dispatch({type: 'SET_RECIPES', payload: recipes})
        },
        fetchRecipe: useCallback( async function (recipe){
            dispatch({type: 'FETCHING_RECIPE', payload: recipe})
            if (!recipe.ingredients){
                recipe = await apiFetch('/recipes/' + recipe.id)
                dispatch({type: 'SET_RECIPE', payload: recipe})
            }
        }, []),
        createRecipe: useCallback( async function(data){
            const recipe = await apiFetch('/recipes', {
                method: 'post',
                body: data
            })
            dispatch({type: 'ADD_RECIPES', payload: recipe})
        }, []),
        updateRecipe: useCallback( async function(recipe, data){
            recipe = await apiFetch('/recipes/' + recipe.id, {
                method: 'put',
                body: data
            })
            dispatch({type: 'SET_RECIPES', payload: recipe})
        }, []),
        deleteRecipe: useCallback( async function(recipe){
            await apiFetch('/recipes/' + recipe.id, {
                method: 'delete',
            })
            dispatch({type: 'DELETE_RECIPES', payload: recipe})
        }, []),
        deselectRecipe: function(){
            dispatch({type: 'DESELECT_RECIPE'})
        }
    }
}

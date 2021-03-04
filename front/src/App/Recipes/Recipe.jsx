import React from 'react'
import PropTypes from 'prop-types'
import {Loader} from "../../UI/Loader";
import {Modal} from "../../UI/Modal";
import {useToggle} from "../../hooks";
import {EditRecipeForm} from "./RecipeForm";
import {Button} from "../../UI/Button";

export function Recipe({ recipe, onClose, onEdit, ingredients, onDelete, onUpdate }) {
    return(
        <Modal title={recipe.title} onClose={onClose}>
            {!recipe.ingredients ?
                <Loader /> :
                <RecipeDetail
                    recipe={recipe}
                    onEdit={onEdit}
                    onUpdate={onUpdate}
                    ingredients={ingredients}
                />
            }
            <Button type="danger" onClick={() => onDelete(recipe)}>Supprimer</Button>
        </Modal>
    )
}

function RecipeDetail({ recipe, ingredients , onEdit, onUpdate }){
    const [editMode, toggleEditMode] = useToggle(false)
    const htmlContent = { __html: recipe.content.split("\n").join('<br/>') }

    const handleUpdate = async function (data) {
        await onUpdate(recipe,data)
        toggleEditMode()
    }

    const handleEditMode = function () {
        toggleEditMode()
        onEdit()
    }

    return editMode ? <EditRecipeForm
        recipe={recipe}
        ingredients={ingredients}
        onSubmit={handleUpdate}
    /> : <>
    <div dangerouslySetInnerHTML={htmlContent}>
    </div>
        <h4 className="mt-4">Ingrédients</h4>
        <ul>
            {recipe.ingredients.map(i => <IngredientRow ingredient={i} key={i.id}/>)}
        </ul>
        <Button onClick={handleEditMode}>Editer</Button>
        </>
}

function IngredientRow({ ingredient }){
    return <li>
        <strong> {ingredient.quantity} {ingredient.unit}</strong> {ingredient.title}
    </li>
}

Recipe.propTypes = {
    recipe: PropTypes.object.isRequired,
}


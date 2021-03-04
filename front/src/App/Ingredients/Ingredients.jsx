import React, {memo, useState} from 'react'
import {Loader} from "../../UI/Loader";
import {Button} from "../../UI/Button";
import {Trash, Upload} from "../../UI/Icon";
import {ApiErrors} from "../../utils/Api";
import {Field} from "../../UI/Field";

export function Ingredients({ingredients, onDelete, onUpdate, onCreate}) {
        return <div>
                <h2>Ingrédients</h2>
                <CreateIngredientForm onSubmit={onCreate}/>
                {ingredients === null ? <Loader/> : <IngredientsList ingredients={ingredients} onDelete={onDelete} onUpdate={onUpdate}/>}
        </div>
}

function IngredientsList({ingredients, onDelete, onUpdate}) {
        return <div>
                {ingredients.map(ingredient => <Ingredient key={ingredient.id} ingredient={ingredient} onDelete={onDelete} onUpdate={onUpdate}/>)}
        </div>
}
const Ingredient = memo(function ({ingredient, onDelete, onUpdate}) {
        const [loading, setLoading] = useState(false)
        const [errors, setErrors] = useState([])

        const handleDelete = async function (e) {
                e.preventDefault()
                setLoading(true)
                await onDelete(ingredient)
        }

        const handleSubmit= async function (e){
                e.preventDefault()
                setErrors([])
                setLoading(true)
                try{
                        await onUpdate(ingredient, new FormData(e.target))
                }catch (e) {
                        if (e instanceof ApiErrors){
                                setErrors(e.errors)
                        }else {
                                throw e
                        }
                }
                setLoading(false)
        }
        const errorFor = function (field) {
                const error = errors.find(e => e.field === field)
                if(error){
                        return error.message
                }
                return null
        }

        return <form className="d-flex align-items-start" onSubmit={handleSubmit}>
                <Field  defaultValue={ingredient.title} name="title" className="mr-2" error={errorFor('tittle')}/>
                <Field defaultValue={ingredient.unit} name="unit" className="mr-2" error={errorFor('unit')}/>
                <Button type="submit" loading={loading}><Upload/></Button>
                <Button type="danger" onClick={handleDelete} loading={loading}><Trash/></Button>
        </form>
})


function CreateIngredientForm({onSubmit}) {
        const [loading, setLoading] = useState(false)
        const [errors, setErrors] = useState([])


        const handleSubmit= async function (e){
                const form = e.target
                e.preventDefault()
                setErrors([])
                setLoading(true)
                try{
                        await onSubmit(new FormData(form))
                       form.reset()
                }catch (e) {
                        if (e instanceof ApiErrors){
                                setErrors(e.errors)
                        }else {
                                throw e
                        }
                }
                setLoading(false)
        }
        const errorFor = function (field) {
                const error = errors.find(e => e.field === field)
                if(error){
                        return error.message
                }
                return null
        }

        return <form className="d-flex align-items-start" onSubmit={handleSubmit}>
                <Field  placeholder="Nom de l'ingrédient" name="title" className="mr-2" error={errorFor('tittle')}/>
                <Field  placeholder="Unitées de mesure" name="unit" className="mr-2" error={errorFor('unit')}/>
                <Button type="submit" loading={loading}>Créer</Button>
        </form>
}
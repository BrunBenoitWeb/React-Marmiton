/**
 * Représente une erreur renvoyer par l'api
 */

export class ApiErrors {
    constructor(errors) {
        this.errors =errors
    }

    get errorsPerField(){
        return this.errors.reduce((acc, error) => {
            return {...acc, [error.field]: error.message}
        }, {})
    }
}

/**
 *
 * @param {string} endpoint
 * @param {object} options
 *
 */

export async function apiFetch(endpoint, options = {}) {
    options ={
        credentials: 'include',
        headers: {
            Accept: 'application/json'
        },
        ...options
    }
    if (options.body !== null && typeof options.body === 'object' && !(options.body instanceof FormData)){
        options.body = JSON.stringify(options.body)
        options.headers['Content-Type'] = 'application/json'
    }

        const response = await fetch('http://localhost:3333' + endpoint, options)
    if (response.status === 204){
        return null
    }
    const responseData= await response.json()
    if (response.ok){
        return responseData
    }else {
            if (responseData.errors){
                throw new ApiErrors(responseData.errors)
            }
    }
}
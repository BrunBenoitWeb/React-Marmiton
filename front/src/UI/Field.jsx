import React from 'react'
import PropTypes from 'prop-types'

export function Field({name, children, type ='text', error,className, ...props }) {
        return <div className={`form-group ${className}`}>
            {children && <label htmlFor={name}>{children}</label>}
            {type === 'textarea' ?
            <textarea name={name} id={name} className={`form-control${error ? 'is-invalid' : ''}`} {...props} /> :
                <input type={type} name={name} id={name} className={`form-control${error ? 'is-invalid' : ''}`} {...props} />
            }
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
}

Field.propTypes = {
    name: PropTypes.string,
    children: PropTypes.node,
    type: PropTypes.string,
    error: PropTypes.string,
    className: PropTypes.string
}
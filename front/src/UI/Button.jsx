import React from 'react'
import PropTypes from 'prop-types'
import {Loader} from "./Loader";

export function Button({children, type = 'primary', loading = false, ...props}) {

    let className = 'btn'
    if (type === 'submit') {
        className += ' btn-primary'
    }else {
        className +=' btn-' + type
    }
    let htmlType = null
    if (type === 'submit') {
        htmlType = 'submit'
    }
    return <button className={className} type={htmlType} disabled={loading} {...props}>
        {loading ? <><Loader size="sm"/> Chargement...</> : children}
    </button>
}
Button.propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    loading: PropTypes.bool
}
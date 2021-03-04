import React from 'react'

export function Loader({size}) {
        return <div className={"spinner-border spinner-border-" + size} role="status">
            <span className="sr-only">Chargement...</span>
        </div>
}
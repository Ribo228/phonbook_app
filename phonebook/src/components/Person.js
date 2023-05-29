import React from 'react'

const Person = ({person,deleteEntry}) => {
    return (
        <li>
            {person.name} {person.number}
            <button onClick = {deleteEntry}>delele</button></li>
    )
}

export default Person
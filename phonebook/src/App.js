import React, { useState, useEffect} from 'react'
import phonebookService from './services/phonebook'
import Person from './components/Person'
import Notification from './components/Notification'
import './index.css'

const Footer =()=>{
  const footerStyle = {
    color:'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return(
    <div style={footerStyle}>
      <br />
      <em> Phonebook app, store or delete your contact? It's your choice </em>
    </div>
  )
}
const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState ('')
  const [newFilter, setNewFilter] = useState('')
  const [Message,setMessage] = useState(null)
  const [MessageType, setMessageType] = useState(null)


  useEffect(() => {
    phonebookService
    .getAll()
    .then(initialPerson => {
      setPersons(initialPerson)
    })
  },[])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    } 
  const existing_person = persons.map(person =>person.name)
  if (existing_person.includes(newName)) {
    const msg =`${newName} is already in the phonebook, replace with new phone? `
    const confirm = window.confirm(msg)
    if (confirm) {
      updatePerson(personObject)
    }
  } else {
  phonebookService
  .create(personObject)
  .then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
    setNewName('')
    setNewNumber('')
    setMessage(`${returnedPerson.name} Added sucessfully`)
    setMessageType ('info')
    setTimeout(() => {
      setMessage(null)
    },3000)
  })
}
  }

  const updatePerson = (personObject) => {
    const update_person = persons.find(person => person.name === personObject.name)
    const update_id = update_person.id
    phonebookService
    .update(update_id, personObject)
    .then(returnedPerson =>
      setPersons(persons.map(person => person.id !== update_id ? person : returnedPerson))
    )
    .catch(error => {
      setMessage(`Sorry ${personObject.name} not found. ${error}`)
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      setPersons(persons.filter(person => person.id !== update_id))
    })
  }

  const deleteName = (person) =>{
    const message = `delete ${person.name}?`
    const confirm = window.confirm(message)
    if (confirm) {
      phonebookService
      .deletePerson(person.id)
      .then(persons =>
        setPersons(persons))
    }
  }

  const handlePersonChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
   
  }

  const personsToShow = newFilter ?
  persons.filter(person => person.name.toLowerCase().includes(newFilter)):
  persons
    
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification msg = {Message} type = {MessageType} />
      filter shown with <input value={newFilter} onChange = {handleFilterChange} />

      <h2>add a  new</h2>
      <form onSubmit ={addPerson}>
        <div>
          name: <input value = {newName} onChange = {handlePersonChange} /> <br></br>
          number:<input value = {newNumber} onChange = {handleNumberChange}/>
      
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      
       <ul>
        {personsToShow.map(person =>
        <Person key = {person.name} person = {person} deleteEntry = {() =>deleteName(person)} />
      )}
        </ul> 
      <Footer />
    </div>
  )
}


export default App
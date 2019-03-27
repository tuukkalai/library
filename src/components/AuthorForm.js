import React, { useState } from 'react'

const AuthorForm = ({ show, editYear, result }) => {
  if (!show) {
    return null
  }
  if (result.loading) {
    return <div>loading...</div>
  }
  const authors = result.data.allAuthors
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  
  const submit = async (e) => {
    e.preventDefault()
    
    await editYear({ 
      variables: { name, born } 
    })
    
    setName('')
    setBorn('')
  }
  
  return (
    <div className='container'>
      <h4>Update author</h4>
      <form onSubmit={submit}>

        <div className='form-group'>
          <label htmlFor='author'>Author</label>
          <select id='author' className='form-control' value={name} onChange={({ target }) => setName(target.value)}>
              {authors.map(a => <option key={a.id}>{a.name}</option>)}
            </select>
        </div>
        <div className='form-group'>
          <label htmlFor='authorborn'>Born</label>
          <input type='text' className='form-control' id='authorborn' placeholder='1987' value={born} onChange={({ target }) => setBorn(parseInt(target.value))}
          />
        </div>
        <button className='btn btn-primary' type='submit'>Update</button>
      </form>
    </div>
  )
}

export default AuthorForm
import React, { useState } from 'react'

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuhtor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  if (!props.show) {
    return null
  }

  const submit = async (e) => {
    e.preventDefault()
    
    await props.addBook({ 
      variables: { title, author, published, genres } 
    })

    setTitle('')
    setPublished('')
    setAuhtor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div className='container'>
      <h2>Add book</h2>
      <form onSubmit={submit}>
        <div className='form-group'>
          <label htmlFor='booktitle'>Title</label>
          <input type='text' className='form-control' id='booktitle' value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='bookauthor'>Author</label>
          <input type='text' className='form-control' id='bookauthor' value={author}
            onChange={({ target }) => setAuhtor(target.value)}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='bookpublished'>Published</label>
          <input type='number' className='form-control' id='bookpublished' value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div className='form-group'>
          <label htmlFor='bookgenre'>Genre</label>
          <div className='input-group mb-3'>
            <input type='text' id='bookgenre' className='form-control' value={genre}
                onChange={({ target }) => setGenre(target.value)} />
            <div className='input-group-append'>
              <button className='btn btn-outline-secondary' onClick={addGenre} type='button'>Add genre</button>
            </div>
          </div>
          <small id='bookgenre' className='form-text text-muted'>
            Genres: {genres.join(' ')}
          </small>
        </div>
        <button className='btn btn-primary' type='submit'>Add book</button>
      </form>
    </div>
  )
}

export default NewBook
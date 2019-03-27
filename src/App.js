import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from 'react-apollo-hooks' 
import Authors from './components/Authors'
import AuthorForm from './components/AuthorForm'
import Books from './components/Books'
import NewBook from './components/NewBook'
import './App.css'

const ALL_AUTHORS = gql`
{
  allAuthors {
    name
    born
    bookCount
    id
  }
}
`

const ALL_BOOKS = gql`
{
  allBooks {
    title
    author
    published
    id
  }
}
`

const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
  ) {
    title
    author
    published
    genres
  }
}
`

const EDIT_YEAR = gql`
mutation editYear($name: String!, $born: Int!) {
  editAuthor(name:$name, setBornTo:$born) {
    name
    born
  }
}
`



const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const handleError = (error) => {
    setErrorMessage(error.graphQLErrors[0].message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const [page, setPage] = useState('authors')
  const getAuthors = useQuery(ALL_AUTHORS)
  const getBooks = useQuery(ALL_BOOKS)
  const addBook = useMutation(CREATE_BOOK, {
    onError: handleError,
    refetchQueries: [{ query: ALL_BOOKS}, {query: ALL_AUTHORS }]
  })
  const editYear = useMutation(EDIT_YEAR, {
    onError: handleError,
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  
  return (
    <div>
      <div className="nav container">
        <button className="btn btn-primary" onClick={() => setPage('authors')}>authors</button>
        <button className="btn btn-primary" onClick={() => setPage('books')}>books</button>
        <button className="btn btn-primary" onClick={() => setPage('add')}>add book</button>
      </div>

      {errorMessage &&
        <div style={{ color: 'red' }}>
          {errorMessage}
        </div>
      }

      <Authors
        show={page === 'authors'}
        result={getAuthors}
      />

      <AuthorForm show={page === 'authors'} editYear={editYear} result={getAuthors} />

      <Books
        show={page === 'books'}
        result={getBooks}
      />

      <NewBook
        show={page === 'add'}
        addBook={addBook}
      />

    </div>
  )
}

export default App

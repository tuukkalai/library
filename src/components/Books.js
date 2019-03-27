import React, { useState } from 'react'
import { gql } from 'apollo-boost'
import { useApolloClient } from 'react-apollo-hooks' 

const DELETE_BOOK = gql`
mutation deleteBook($id: ID!){
  deleteBook(id:$id) {
    title
  }
}
`
const Books = (props) => {

  const client = useApolloClient()

  const [book, setBook] = useState(null)

  if (!props.show) {
    return null
  }

  if (props.result.loading) {
    return <div>loading...</div>
  }

  const books = props.result.data.allBooks

  const deleteBook = async (id) => {
    const { data } = await client.mutate({
      mutation: DELETE_BOOK,
      variables: { id: id }
    })
    setBook(data.deleteBook)
  }
  if(book){
    console.log('deleted ', book)
  }

  return (
    <div className='container'>
      <h2>Books</h2>
      <table className='table'>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
            <th></th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
              <td><button className='btn btn-primary' onClick={() => deleteBook(a.id)}>&times;</button></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Books
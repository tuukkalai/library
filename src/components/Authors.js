import React from 'react'
//import { useApolloClient } from 'react-apollo-hooks'

const Authors = (props) => {
  if (!props.show) {
    return null
  }
  if (props.result.loading) {
    return <div>loading...</div>
  }

  const authors = props.result.data.allAuthors

  return (
    <div className='container'>
      <h2>Authors</h2>
      <div className='table-responsive'>
        <table className='table'>
          <tbody>
            <tr>
              <th>Author</th>
              <th>
                Born
              </th>
              <th>
                Books
              </th>
            </tr>
            {authors.map(a =>
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Authors
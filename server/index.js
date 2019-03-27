const { ApolloServer, UserInputError, gql } = require('apollo-server')
const uuid = require('uuid/v1')

let authors = [
  {
    name: 'Nick Morgan',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Eric Elliott',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Marijn Haverbeke',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Douglas Crockford',
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'David Herman',
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Boris Smus',
    id: "afa5b6f4-344d-11e9-a411-719c6709cf3e",
  },
]

let books = [
  {
    title: 'JavaScript for Kids: A Playful Introduction to Programming',
    published: 2008,
    author: 'Nick Morgan',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['javascript']
  },
  {
    title: 'Composing Software',
    published: 2002,
    author: 'Eric Elliott',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Eloquent JavaScript: A Modern Introduction to Programming',
    published: 2018,
    author: 'Marijn Haverbeke',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'JavaScript: The Good Parts',
    published: 2008,
    author: 'Douglas Crockford',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Programming JavaScript Applications: Robust Web Architecture with Node, HTML5, and Moderns JS Libraries',
    published: 2012,
    author: 'Eric Elliott',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Effective JavaScript: 68 Specific Ways to Harness the Power of JavaScript',
    published: 2016,
    author: 'David Herman',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['modern', 'javascript']
  },
  {
    title: 'Web Audio API',
    published: 2018,
    author: 'Boris Smus',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['audio', 'api', 'javascript']
  },
]

const typeDefs = gql`
  type Author {
    name: String!
    born: Int
    id: ID!
    bookCount: Int
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String]
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }
  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]
    ): Book
    editAuthor (
      name: String!
      setBornTo: Int!
    ): Author
    deleteBook (
      id: ID!
    ): Book
  }
`

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      if(args.author && args.genre){
        const authorsBooks = books.filter(b => b.author === args.author)
        return authorsBooks.filter(b => b.genres.includes(args.genre))
      }
      if(args.genre){
        return books.filter(b => b.genres.includes(args.genre))
      }
      if(args.author){        
        return books.filter(b => b.author === args.author)
      }      
      return books
    },
    allAuthors: () => authors
  },
  Author: {
    bookCount: (root) => books.filter(b => b.author === root.name).length
  },
  Mutation: {
    addBook: (root, args) => {
      if (books.find(b => b.title === args.title)) {
        throw new UserInputError('Name must be unique', {
          invalidArgs: args.name,
        })
      }
      if(authors.filter(a => a.name === args.author).length === 0){
        const author = { name: args.author, id: uuid() } 
        authors = authors.concat(author)
      }
      const book = { ...args, id: uuid() }
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      console.log(author + ' ' + args.setBornTo)
      if(!author){
        return null
      }
      const updatedAuthor = {...author, born: args.setBornTo}
      authors = authors.map(a => a.name === author.name ? updatedAuthor : a)
      return updatedAuthor
    },
    deleteBook(root, args) {
      const index = books.findIndex(b => b.id === args.id)
      let delBook = books[index];
      const filter = books.filter(b => b.id !== args.id)
      books = filter

      return delBook
  }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
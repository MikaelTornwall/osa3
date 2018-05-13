// const morganBody = require('morgan-body')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

morgan.token('body', (req, res) => {
  const body = req.body
  return JSON.stringify(body)
})

app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
// morganBody(app)
app.use(cors())
app.use(express.static('build'))

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1,
      "show": true
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2,
      "show": true
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3,
      "show": true
    },
    {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4,
      "show": true
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  console.log(person)

if (person) {
  res.json(person)
} else {
  res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  const quantity = persons.length
  const time = new Date()
  res.send(`<p>Puhelinluettelossa on ${quantity} henkilön tiedot</p> <br> ${time}`)
})

const generateId = () => {
  return Math.floor(Math.random()*1000)
}

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (persons.filter(person => person.name === body.name).length > 0) {
    return res.status(400).json({error: 'name must be unique'})
  }

  if (body.name.length === 0 || body.number.length === 0) {
    return res.status(400).json({error: 'empty fields are not allowed '})
  }

  const person = {
    name: body.name,
    number: body.number,
    show: body.show,
    id: generateId()
  }

  persons = persons.concat(person)

  console.log(person)
  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

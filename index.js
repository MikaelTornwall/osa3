// const morganBody = require('morgan-body')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())

morgan.token('body', (req, res) => {
  const body = req.body
  return JSON.stringify(body)
})

// morganBody(app)
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

/*
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
*/


/*
const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    show: person.show,
    id: person._id
  }
}
*/

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  console.log(Person)
  Person
  .find({}, {__v: 0})
  .then(persons => {
    res.json(persons.map(Person.format))
  }).catch(error => {
    console.log(error)
    res.status(404).end()
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      if (person) {
      res.json(Person.format(person))
    } else {
      res.status(404).end()
    }
    }).catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.get('/info', (req, res) => {
Person
.find({})
.then(persons => {
  const quantity = persons.length
  const time = new Date()
  res.send(`<div style="background:black; color:white; font-family:monospace; padding:.2rem; margin:3rem; text-align:center;"><p>Puhelinluettelossa on ${quantity} henkilön yhteystiedot.</p> <p>${time}</p></div>`)
})
})

//const generateId = () => {
  //return Math.floor(Math.random()*1000)
//}

app.post('/api/persons', (req, res) => {
  const body = req.body

if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({error: 'Name or number is missing'})
}

  const person = new Person({
    name: body.name,
    number: body.number,
    show: body.show || true
  })

  console.log(`Person "${person.name}" has been added to the database!`)

  person
  .save()
  .then(savedPerson => {
    res.json(Person.format(savedPerson))
  }).catch(error => {
    console.log(error)
    res.status(404).end()
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
  .findByIdAndRemove(req.params.id)
  .then(result => {
  res.status(204).end()
}).catch(error => {
  res.status(400).send({ error: 'malformatted id' })
})
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
  .findByIdAndUpdate(req.params.id, person, { new: true } )
  .then(updatedPerson => {
    res.json(Person.format(updatedPerson))
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: 'malformatted id' })
  })
})

const error = (req, res) => {
  res.status(404).send({ error: 'Something went wrong '})
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

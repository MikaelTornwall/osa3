const mongoose = require('mongoose')
const url = "mongodb://contacts_base:contacts_base@ds119110.mlab.com:19110/miksun_contacts"

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String,
  show: Boolean
})

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
  show: true
})

if (process.argv[2] !== undefined && process.argv[3] !== undefined) {
person
.save()
.then(response => {
  console.log(`Lisätään henkilö "${person.name}" ja numero "${person.number}" luetteloon.`)
  mongoose.connection.close()
})
}

if (process.argv[2] === undefined && process.argv[3] === undefined) {
Person
.find({})
.then(result => {
  console.log("Puhelinluettelo:")
result.forEach(person => {
  console.log(person.name, person.number)
})
mongoose.connection.close()
})
}

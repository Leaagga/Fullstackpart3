require('dotenv').config()
const express = require('express')
const morgan=require('morgan')
const app = express()
const Person=require('./models/person')
app.use(express.json())
app.use(morgan(function(tokens, req, res){
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
const cors=require('cors')
app.use(cors())
app.use(express.static('build'))
app.get('/api/persons',(request,response)=>{
  Person.find({})
    .then(person=>{
      response.json(person)
    })
})
app.get('/info',(resquest,response)=>{
    response.send(`<div><p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p></div>`)
})
app.get('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id)
    const person=persons.find(p=>p.id===id)
    if (person){
        response.json(person)
    }else{
        response.status(404).end()
    } 
})
app.delete('/api/persons/:id',(request,response)=>{
    const id=Number(request.params.id)
    persons=persons.filter(p=>p.id!==id)
    response.status(204).end()   
})
const generateId=()=>{
    const Id=persons.length>0
    ?Math.floor(Math.random()*100)
    :0
    if (persons.find(p=>p.id===Id)){
        Id=generateId()
    }
    return Id
}
app.post('/api/persons',(request,response)=>{
    const body=request.body
    console.log(body)
    if (!body.name){
        response.status(400).json({error: 'name missing'})
    }
    if (!body.number){
        response.status(400).json({error: 'number missing'})
    }
    if (persons.find(p=>body.name===p.name)){
        response.status(400).json({error: 'name must be unique'})
    }
    const person={
        "id":generateId(),
        "name":body.name,
        "number":body.number
    }
    persons=persons.concat(person)
    response.json(person)
})
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
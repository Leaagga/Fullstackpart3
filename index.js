require('dotenv').config()
const express = require('express')
const morgan=require('morgan')
const app = express()
const Person=require('./models/person')
const cors=require('cors')
app.use(cors())
app.use(express.static('build'))
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

app.get('/api/persons',(request,response)=>{
  Person.find({})
    .then(person=>{
      response.json(person)
    })
})
app.get('/info',(resquest,response)=>{
  Person.estimatedDocumentCount().then(result=>{
    response.send(`<div><p>Phonebook has info for ${result} people</p>
    <p>${new Date()}</p></div>`)
    })

})
app.get('/api/persons/:id',(request,response,next)=>{
  Person.findById(request.params.id)
    .then(person=>{if (person){
      response.json(person)
    }else{
      response.status(404).end()
    }})
    .catch(error=>{next(error)
    }
    )
})
app.delete('/api/persons/:id',(request,response)=>{
  Person.findByIdAndRemove(request.params.id)
    .then(()=>{
      response.status(204).end()
    })
})

app.post('/api/persons',(request,response,next)=>{
    const body=request.body
    console.log(body)
    if (!body.name){
        response.status(400).json({error: 'name missing'})
    }
    if (!body.number){
        response.status(400).json({error: 'number missing'})
    }

    const person=new Person({
        "name":body.name,
        "number":body.number
    })
    person.save()
      .then(savedPerson=>
      response.json(savedPerson)
    )
      .catch(error=>next(error))
})
app.put('/api/persons/:id',(request,response,next)=>{
  const body=request.body

  Person.findByIdAndUpdate(request.params.id,{number:body.number},{new:true,runValidators:true})
      .then(updatedPerson=>
        response.json(updatedPerson))
      .catch(error=>next(error))
})
const unknownEndpiont=(request,response)=>{
  response.status(404).end()
}
app.use(unknownEndpiont)
const erorrHandler=(error,request,response,next)=>{
  console.log(error.message)
  if (error.name=='CastError'){
    return response.status(400).send({error:'malformatted eror'})
    
  }
  if (error.name=='ValidationError'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}
app.use(erorrHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
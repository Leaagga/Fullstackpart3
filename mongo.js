const mongoose=require('mongoose')
const password = process.argv[2]
const url=`mongodb+srv://fullstack:${password}@cluster0.77bjzst.mongodb.net/phonebookApp?retryWrites=true&w=majority`
const personSchema=new mongoose.Schema({
        name:String,
        number:String})
const Person=mongoose.model('Person',personSchema)



if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}
if (process.argv.length===5){
    mongoose.connect(url)
    personname=process.argv[3]
    personnumber=process.argv[4]
    const person=new Person({
        name:personname,
        number:personnumber
    })
    person.save().then(result=>{
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
}
if (process.argv.length===3){
    console.log('Phonebook:')
    mongoose.connect(url)
    Person
        .find({})
        .then(result=>{
            result.forEach(person=>{
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
    })
}



/* const addPerson=()=>{
    mongoose.connect(url)
    personname=process.argv[3]
    personnumber=process.argv[4]
    const person=new Person({
        name:personname,
        number:personnumber
    })
    person.save().then(result=>{
        console.log(`Added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })

}
const getPerson=()=>{
    console.log('Phonebook:')
    Person
        .find({})
        .then(result=>{
            mongoose.connect(url)
            result.forEach(person=>{
                console.log(`${person.name} ${person.number}`)
            })
            mongoose.connection.close()
    })

} */





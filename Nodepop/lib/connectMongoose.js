import mongoose from 'mongoose'

mongoose.connection.on('error', err=>{
    console.log('Error de conexión', err)
})

export default function connectMongoose(){
    return mongoose.connect('mongodb://127.0.0.1/NodePop')
    .then(mongoose => mongoose.connection)
}
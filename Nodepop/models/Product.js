import mongoose,{Schema} from 'mongoose'

//definir el esquema de los agentes

const productSchema = Schema({
    name: {type: String, unique: true},
    price: {type: Number, min: 0 ,max:2000},
    owner:{type: Schema.Types.ObjectId, ref:'User'},
    image:{type:String},
    tags:{
        type:[String],
        enum:['work','lifestyle','motor','mobile']
    }
   
})

//creamos el modelo de producto

const Product = mongoose.model('Product', productSchema)

export default Product
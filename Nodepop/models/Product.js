import mongoose,{Schema} from 'mongoose'
import { index } from '../controllers/homeController.js'

//definir el esquema de los agentes

const productSchema = Schema({
    name: {type: String, unique: false },
    price: {type: Number, min: 0 ,max:2000, index: true},
    owner:{type: Schema.Types.ObjectId, ref:'User',index: true},
    image:{type:String},
    tags:{
        type:[String],
        enum:['work','lifestyle','motor','mobile']
    }
   
})
// esto hace return list of products
productSchema.statics.list = function(filter, limit, skip, sort, fields){
    const query = Product.find(filter)
    query.limit(limit)
    query.skip(skip)
    query.sort(sort)
    query.select(fields)
    return query.exec()
}
//creamos el modelo de producto

const Product = mongoose.model('Product', productSchema)

export default Product
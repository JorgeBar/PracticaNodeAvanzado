import Product from '../../models/Product.js'
import createError from 'http-errors'

/**
 * @openapi
 * /api/products:
 *  get:
 *    security:
 *      - BearerAuth: []
 *    description: |
 *      Return list of products
 *      <br />
 *      <b>Examples:</b>
 *      pagination:      http://localhost:3000/api/products?skip=2&limit=2
 *      sorting:         http://localhost:3000/api/products?sort=-price%20name
 *      field selection: http://localhost:3000/api/products?fields=price%20-_id
 *    parameters:
 *      - in: query
 *        name: skip
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Returns JSON
 */

export async function apiProductList( req,res,next) {

    try {
        const userId = req.apiUserId
        //http://localhost:3000/api/products/?name=Cosa&Price=12
        const filterprice = req.query.price
        const filtername = req.query.name
        //http://localhost:3000/api/products/?limite=2&skip=2
        const limit = req.query.limit
        const skip = req.query.skip
        const sort = req.query.sort
        //http://localhost:3000/api/products/?fields=name -_id
        const fields = req.query.fields


        const filter = {owner: userId }
        if(filterprice){
            filter.price = filterprice
        }
        if(filtername){
            filter.name = filtername
        }

        const [products, countproducts] = await Promise.all([
            Product.list(filter, limit,skip , sort, fields),
            Product.countDocuments(filter)
    
        ])
        
        
        res.json({
            results: products,
            count: countproducts
        })
    } catch (error) {
        next(error)
    }

}

export async function apiProductGetOne(req,res,next) {

    try {
        const userId = req.apiUserId
        const productId = req.params.productId

        const product = await Product.findOne({_id: productId, owner: userId})
        //http://localhost:3000/api/products/67a0a910dbd8fd027c3bbd31
        res.json({result:product})
        
    } catch (error) {
        next(error)
    }
    
}

export async function apiProductNew(req,res,next) {
    
    try {
        const userId = req.apiUserId
        const productData = req.body
        
        //create product instance in memory
        const product = new Product(productData)
        product.owner = userId
        product.image = req.file?.filename
        //save product
        const savedProduct = await product.save()

        res.status(201).json({result : savedProduct})
        
    } catch (error) {
        next(error)
    }
}

export async function apiProductUpdate(req,res ,next) {
    try {
        const userId = req.apiUserId
        const productId = req.params.productId
        const productData = req.body
        productData.image= req.file?.filename

        const updatedProduct = await Product.findOneAndUpdate({ _id: productId, owner: userId}, productData,{
            new: true
        })
        res.json({result : updatedProduct})
        
    } catch (error) {
        next(error)
    }
}


export async function apiProductDelete(req, res, next) {
    try {
        const userId = req.apiUserId
        const productId = req.params.productId

        // validar que el documento quer queremos borrar pertenece al usuario
        const product = await Product.findOne({_id: productId})

        //verificamos si existe
        if(!product){
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto inexistente`)
            return next(createError(404))

        }
        //comprobamos la propiedad antes de eliminar
        //product.owner es un ObjectId y para compararlocon un string necesitamos convertirlo a trexto
        if(product.owner.toString() !==userId){
            console.warn(`WARNING - el usuario ${userId} esta intentando eliminar un producto de otro usuario`)
            return next(createError(401))

        }

        await Product.deleteOne({_id: productId})   
        res.json() 
    } catch (error) {
        next(error)
    }
}
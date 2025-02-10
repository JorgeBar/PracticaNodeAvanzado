import assert from 'node:assert'
import {query ,validationResult} from 'express-validator'
import Product from '../models/Product.js'
import {io} from '../webSocketServer.js'


export async function index(req, res , next){

    const userId = req.session.userId
    const filterprice = req.query.price
    const filtername = req.query.name
    const limit = req.query.limit
    const skip = req.query.skip
    const sort = req.query.sort
    
    if(userId){

        const filter = {owner: userId}
        if(filterprice){
            filter.price = filterprice
        }
        if(filtername){
            filter.name = filtername
        }
        res.locals.products = await Product.list(filter, limit, skip, sort )

        setTimeout(()=>{
            console.log('Sending welcome message to userwith sessionId', req.session.id)
            io.to(req.session.id).emit('server-message', `Welcome user : ${userId}`)
        },2000)
    }

    res.render('home')
    
}
// GET /param_in_route/44
export function paraInRouteExample(req , res ,next){
    const num = req.params.num

    res.send('Received ' + num)

}
// GET /param_in_route_multiple/camiseta/size/37/color/red
export function paraInRouteMultipleExample(req , res ,next){
    const product = req.params.product
    const size = req.params.size
    const color = req.params.color

    res.send(`Received ${product}, size ${size} , color ${color}`)

}

//GET /param_in_query?size=S&color=blue

export function paramInQuery(req, res, next) {
    const size = req.query.size
    const color = req.query.color

    res.send(`Received size ${size} , color ${color}`)
}

//POST /CREATE-EXAMPLE

export function createExample(req,res ,next){
    const item = req.body.item

    //validation
    assert(item , 'item is required')

    res.send('Received ' + item)
}

//validaciones express validator
export const validateQueryExampleValidations = [//valdiador con nuestros requerimientos
    query('param1')
        .isLength({ min: 4})
        .withMessage('min 4 characters'),
    query('param2')
        .isNumeric()
        .withMessage('must be numeric'),
    query('param3')
        .custom( value => value === '42')
        .withMessage ('must be 42')
]
export function validateQueryExample( req, res, next){
    validationResult(req).throw()
    const param1 = req.query.param1
    const param2 = req.query.param2

    res.send(`Validated  ${param1} ${param2}`)
}
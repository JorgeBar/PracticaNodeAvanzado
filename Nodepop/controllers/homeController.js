import assert from 'node:assert'

export function index(req, res , next){

    const now = new Date()

    res.locals.nombre = 'Jorge'
    res.locals.isEven = (now.getSeconds() % 2 ) === 0
    res.locals.actualSeconds = now.getSeconds()
    res.locals.users = [
        { name: 'Smith', age: 30},
        { name: 'Brown', age: 42}
    ]
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
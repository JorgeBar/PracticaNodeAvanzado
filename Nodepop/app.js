import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import  * as homeController from  './controllers/homeController.js'

const app = express()

app.locals.appName = 'NodePop!!!'

app.set('views', 'views') //views folder
app.set('view engine','ejs')

app.use(logger('dev'))
app.use(express.json())//parsear el body que venga en formato JSON
app.use(express.urlencoded({ extended: false}))//parsear el body que venga en urlencoded (formularios)
app.use(express.static('public'))

app.get('/', homeController.index)
app.get('/param_in_route/:num', homeController.paraInRouteExample)
app.get('/param_in_route_multiple/:product/size/:size([0-9]+)/color/:color', homeController.paraInRouteMultipleExample)

app.get('/param_in_query' , homeController.paramInQuery)
app.post('/create-example' , homeController.createExample)
app.get('/validate-query-example' ,
    homeController.validateQueryExampleValidations  ,
     homeController.validateQueryExample)


//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
  })

// Middleware de manejo de errores
app.use((err, req, res, next) => {  
// validation errors

if(err.array){
    err.message = 'Invalid request: ' + err.array()
        .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)
        .join(', ')
    err.status  = 422  
}

 res.status(err.status || 500)
  
 //set locals, only provding error in development
 res.locals.message = err.message
 res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

//render error view
res.render('error')   
})  

  
export default app
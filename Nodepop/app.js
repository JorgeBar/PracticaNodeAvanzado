import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import  * as homeController from  './controllers/homeController.js'
import connectMongoose from './lib/connectMongoose.js'
import * as loginController from  './controllers/loginController.js'
import * as sessionManager from './lib/sessionMannager.js'
import * as productsController from './controllers/productsController.js'

await connectMongoose()
console.log('Conectado a MongoDB')

const app = express()

app.locals.appName = 'NodePop'//variables de vistas para toda la aplicacion.Asi no tenemos que crearlo en todos
//los controladores, solo cargarla en las vistas

app.set('views', 'views') //views folder primera es la variable , sedunda es la carpeta
app.set('view engine','ejs')//motor de plantillas

app.use(logger('dev'))//enseña logs en la consola de las peticiones que hagamos
app.use(express.json())//parsear el body que venga en formato JSON
app.use(express.urlencoded({ extended: false}))//parsear el body que venga en urlencoded (formularios)
app.use(express.static('public'))//esto hace que el browser me devuelva lo que esta en esta carpeta

//Aplication routes

app.use(sessionManager.middleware , sessionManager.useSessionInViews)

//public pages
app.get('/', homeController.index)
app.get('/login', loginController.index)
app.post('/login', loginController.postLogin)
app.all('/logout', loginController.logout)
app.post('/products/new', productsController.validateProduct, productsController.postNew);


//private pages products
app.get('/products/new', sessionManager.isLoggedIn, productsController.index);
app.post('/products/new',sessionManager.isLoggedIn, productsController.postNew);
app.get('/products/delete/:productId', sessionManager.isLoggedIn, productsController.deleteProduct);
app.use(express.static('public'));





//params examples
app.get('/param_in_route/:num?', homeController.paraInRouteExample)
app.get('/param_in_route_multiple/:product/size/:size([0-9]+)/color/:color', homeController.paraInRouteMultipleExample)
app.get('/param_in_query' , homeController.paramInQuery)
app.post('/create-example' , homeController.createExample)

app.get('/validate-query-example' ,
    homeController.validateQueryExampleValidations  , //esto es para que atienda primero a las validaciones
     homeController.validateQueryExample)


//catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
  })

// Middleware de manejo de errores
app.use((err, req, res, next) => {  
// validation errors

    if(err.array){
        err.message = 'Invalid request: ' + err.array()//esto devuelve un array de objetos
            .map(e => `${e.location} ${e.type} ${e.path} ${e.msg}`)// con esto devuelve otro array que devuelva un template
            //string con esos parametros de arriba 
            .join(', ')//los unimos todos en una sola linea. Esto todo mostrara el mensaje que vemos de "Invalid request:query field..."
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
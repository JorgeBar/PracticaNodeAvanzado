import express from 'express'
import createError from 'http-errors'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import  * as homeController from  './controllers/homeController.js'
import connectMongoose from './lib/connectMongoose.js'
import * as loginController from  './controllers/loginController.js'
import * as sessionManager from './lib/sessionMannager.js'
import * as productsController from './controllers/productsController.js'
import upload from './lib/uploadConfigure.js'
import i18n from './lib/i18nConfigure.js'
import * as langController from './controllers/langController.js'
import * as apiProductsController from './controllers/api/api-productsController.js'
import swaggerMiddleware from './lib/swaggerMiddleware.js'
import * as apiLoginController from './controllers/api/api-loginController.js'
import * as jwtAuth from './lib/jwtAuthMiddleware.js'
import basicAuthMiddleware from './lib/basicAuthMIddleware.js'

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
app.use(cookieParser())

//API  routes

app.post('/api/login', apiLoginController.loginJWT)

//CRUD operations for products resource
app.get('/api/products',jwtAuth.guard, apiProductsController.apiProductList)
app.get('/api/products/:productId',jwtAuth.guard, apiProductsController.apiProductGetOne)
app.post('/api/products',jwtAuth.guard,upload.single('image'), apiProductsController.apiProductNew)
app.put('/api/products/:productId',jwtAuth.guard,upload.single('image'), apiProductsController.apiProductUpdate)
app.delete('/api/products/:productId',jwtAuth.guard, apiProductsController.apiProductDelete)


//Website  routes

app.use(sessionManager.middleware , sessionManager.useSessionInViews)
app.use(i18n.init)
app.get('/change-locale/:locale', langController.changeLocale)// a esto se le llama parametro en ruta

//public pages
app.get('/', homeController.index)//añadimos esto antes del homeController si queremos usar el basic Auth basicAuthMiddleware,
app.get('/login', loginController.index)
app.post('/login', loginController.postLogin)
app.all('/logout', loginController.logout)
app.post('/products/new', productsController.validateProduct,upload.single('image'), productsController.postNew);
app.use('/api-doc', swaggerMiddleware)


//private pages products
app.get('/products/new', sessionManager.isLoggedIn, productsController.index);
//app.post('/products/new',sessionManager.isLoggedIn, productsController.postNew);//no funciona la subida de la imagen  upload.single('fotos'),
app.post('/products/new',sessionManager.isLoggedIn,upload.single('image'),  productsController.postNew);
app.get('/products/delete/:productId', sessionManager.isLoggedIn, productsController.deleteProduct);
app.use(express.static('public')); // Para archivos estáticos como CSS, JS, etc.

//app.use('/images', express.static('images')); // Para las imágenes subidas





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

 // API error, send response with JSON
 if (req.url.startsWith('/api/')) {
    res.json({error: err.message})
    return
    //example http://localhost:3000/api/product/
 }
  
 //set locals, only provding error in development
 res.locals.message = err.message
 res.locals.error = process.env.NODEPOP_ENV === 'development' ? err : {}

//render error view
res.render('error')   
})  

  
export default app
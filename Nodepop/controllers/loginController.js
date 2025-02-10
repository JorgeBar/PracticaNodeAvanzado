import User from '../models/User.js'
import {io} from '../webSocketServer.js'


export function index(req,res,next){
    res.locals.error = ''
    res.locals.email = ''
    res.render('login')
}

export async function postLogin(req, res ,next){
    try {
        const { email, password} = req.body
    
        // buscar el usuario en la base de datos
    const user = await User.findOne({email: email.toLowerCase()})
        //si no lo encuentro, o la contraseña no coincide ---> error credenciales invalidas
        if (!user  || !(await user.comparePassword(password))){
            res.locals.error = 'Invalid credentials'
            res.locals.email = email
            res.render('login')
            return
        }

        // si el usuario existe y la contraseña es correcta --> apuntar en su sesión que está loggado

        req.session.userId = user._id
        req.session.userName = user.email

        //enviar un email al usuario
         user.sendEmail('Bienvenido', 'Bienvenido a Nodepop')

        //redirect a la home
        res.redirect('/')
    } catch (error) {
        next(error)
    }

}

export function logout(req,res,next){
    const previousSessionId = req.session.id
    req.session.regenerate(err=>{
        if(err) return next(err)
        io.in(previousSessionId).disconnectSockets()
        res.redirect('/')
    })
}
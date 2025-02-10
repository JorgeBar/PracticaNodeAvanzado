import basicAuth from 'basic-auth'

export default function(req,res,next){
    const user = basicAuth(req)
    if( !user || user.name !== 'admin' || user.pass!== '1234'){
        res.set('WWW-Authenticate', 'Basic realm=Authorization required')
        res.sendStatus(401)
        return
    }
    next()
}

//este método tiene poca seguridad
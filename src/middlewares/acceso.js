const jwt = require('jsonwebtoken')
const config = require('../config/config')
//const {deleteSession} = require('../query/Session.query')

async function isAuth(req,res,next){
    
    if(!req.headers.token){
        return res.status(403).send({err: "No Tiene Autorización"})
    }

    const token =req.headers.token
    jwt.verify(token, config.SECRET_TOKEN, async (e,payload)=>{
        if(e){
            await deleteSession(token,res)
            return res.status(401).send({err: "El token ha caducado"})
        }
        req.user = payload.usr
        next()
    })    
}

module.exports = {
    isAuth
}
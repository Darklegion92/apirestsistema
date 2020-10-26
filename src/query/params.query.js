const conexionFirebird = require('../config/conectionFirebird')
function findParams(user, password){
    const con = conexionFirebird(user,password)
    con.query
    return 
} 



module.exports = {
    findParams
}
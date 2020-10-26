const ConexionMysql = require('../config/conectionDB')

async function createSession(user,password,token,res){
    const con = ConexionMysql();
    await con.query('INSERT INTO sessions SET?',{
      token,
      user: user,
      password: password
    },(e,r)=>{
      if(e)
        return res.status(500).send(e);
    })
}

function deleteSession(token,res){
    const con = ConexionMysql();
    con.query('DELETE FROM sessions WHERE token =?',[token],(e,r)=>{
      if(e)
        return res.status(500).send(e);
    })
}
function findSession(user,callback){
  const con = ConexionMysql();
  con.query("SELECT password, token FROM sessions WHERE user= ?",[user],(err,r)=>{
    if (err) 
      callback(err,null);
    else
      callback(null,r[0]);
  })
  
}


module.exports = {
    createSession,
    deleteSession,
    findSession
}
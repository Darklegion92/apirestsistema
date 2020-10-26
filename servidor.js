const CONFIG = require('./src/config/config')
const APP = require('./src/api')

APP.listen(CONFIG.PORT,(err)=>{
    if(err) return console.log(err);
    console.log(`Servidor En El Puerto ${CONFIG.PORT}`);
})
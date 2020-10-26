const Articulos = require('../models/Articulo')


//
async function validarCarrito(req,res,next){
    if(req.body){
        let tam = 0  
        let i = 0  
        const datos = req.body

        datos.forEach(async item => {
            tam++
        }); 

        datos.forEach(async item => {
            
            let validacion = false
            const articulo = await Articulos.findById(item._id)
            .catch(err =>{res.status(500).send({err:err})})
            if(articulo.precio == item.precio && articulo.codigo == item.codigo){
                i++
                validacion=true
                if(i===tam){
                    if(validacion){
                        next()
                    }
                }
            }else{
                return res.status(402).send({res:"Datos no coinciden"}) 
            }
        })
    }else{
        return res.status(202).send({res:"No hay datos para registrar"})
    } 
}

module.exports = {
    validarCarrito
}
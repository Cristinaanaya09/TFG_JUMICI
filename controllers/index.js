const { models } = require('../models');

// Autoload la escena asociado a :sceneId                                                           //Sin esto no coges los Id, legas a la página de grupos pero no puedes entrar en ninguno. Es muy importante en next.
exports.load = async (req, res, next, sceneId) => {

    try {
        console.log(" PARAMS")
        const scene = await models.Scene.findByPk(sceneId);
        console.log(" OK1")
        if (scene) {
            req.load = {...req.load, scene};
            console.log(" OK2")
            next();
        } else {
            throw new Error('There is no scene with id=' + sceneId);
        }
    } catch (error) {
        next(error);
    }
};

exports.index = async (req, res, next) => {
    try {
        console.log("MOSTRAR ESCENA")
        let escenas = await models.Scene.findAll();
        let admin;
        if (req.user.role === "PROFE")
            admin = true;
        res.render('index', { escenas, admin });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.crear = async (req, res, next) => {
    try {
        console.log("CREAMOS ESCENA")
        let image;
        if(req.body.image.length=== 0){
           
            image = "/app/ciberseguridad.jpg" 
        } else{
            image= req.body.image;
        }  
        let scene ={
            name: req.body.name,
            rutaImagen: image,
            descripcion: req.body.description,
        }
        await models.Scene.create(scene);
        res.redirect('index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.delete = async (req, res, next) => {
    try {
        console.log("BORRAMOS ESCENA: " +req.load.scene.id)
        let scene = await models.Scene.findByPk(req.load.scene.id)
        await scene.destroy();
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.edit = async (req, res, next) => {
    try {
        
        console.log("EDITAMOS ESCENA: " +req.load.scene.id)
        let scene = await models.Scene.findByPk(req.load.scene.id)
      console.log("name:  " + req.body.name)
      console.log("ruta:  " + req.body.image)
      console.log("desc" + req.body.description)
      
        await scene.update({name: req.body.name,
            rutaImage: req.body.image,
            descripcion: req.body.description});
            console.log("EDITAMOS save: " +req.load.scene.id)
        scene.save()
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
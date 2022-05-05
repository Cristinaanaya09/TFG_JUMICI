const { models } = require('../models');
//const createScene = require("../public/game/JUMICI/createScene");

const fs = require("fs");

// Autoload la escena asociado a :sceneId                                                           //Sin esto no coges los Id, legas a la página de grupos pero no puedes entrar en ninguno. Es muy importante en next.
exports.load = async (req, res, next, sceneId) => {

    try {
        console.log(" PARAMS")
        const scene = await models.Scene.findByPk(sceneId);
        console.log(" OK1")
        res.locals.load = scene;
        if (scene) {
            req.load = { ...req.load, scene };
            console.log(" OK2")
            console.log(" req:  " + req.load.scene.id)
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
        let show = false;
        let escenas = await models.Scene.findAll();


        //Check if it's admin
        let admin;
        if (req.user.role === "PROFE")
            admin = true;

        res.render('index', { escenas, admin, show });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}




exports.enabled = async (req, res, next) => {
    try {
        console.log("DESABILITAMOS ESCENA: " + req.load.scene.id + "    otro:  " + req.params.sceneId +  "    otro:  " + req.body.enabled +  "    pruebaTrue:  " + !Boolean("true") + " kk sin comillas " + !false + " ll False " + !Boolean("false"))
        let scene = await models.Scene.findByPk(req.params.sceneId)
        if(scene.enabled===false){
            scene.enabled = true;
           
        }else{
            scene.enabled = false;
        }
        scene.save();
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.delete = async (req, res, next) => {
    try {
        console.log("BORRAMOS ESCENA: " + req.load.scene.id)
        let scene = await models.Scene.findByPk(req.load.scene.id)
        await scene.destroy();
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.showEdit = async (req, res, next) => {
    try {
        console.log("ACCEDEMOS A EDIT: " + req.load.scene.id)

        //For editing the card
        let images = fs.readdirSync("./public/images/app")
        let scene = await models.Scene.findByPk(req.load.scene.id)
        console.log(scene.json)
        const jsonAction = require("../public/game/JUMICI/scenes/" + scene.json);
        const json = require("../public/game/JUMICI/languages/" + jsonAction.language + '.json');


        //For editing questions and answers
        let answer = true;
        let message=true;
        let correctAnswers = await models.Answer.findAll({where: {game: scene.id}})
        res.render('edit', { scene, images, json, answer, message, correctAnswers });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.edit = async (req, res, next) => {
    try {

        console.log("EDITAMOS ESCENA: " + req.load.scene.id)
        let scene = await models.Scene.findByPk(req.load.scene.id)
        console.log("name:  " + req.body.name)
        console.log("ruta:  " + req.body.image)
        console.log("desc" + req.body.description)
        
        //Check if there is already a game with that name
        let gameExist = await models.Scene.findAll({where: {name: scene.name}})
        if(gameExist){
            res.redirect('/edit/' + req.load.scene.id);
        }

        //Edit the game
        await scene.update({
            name: req.body.name,
            rutaImage: req.body.image,
            descripcion: req.body.description
        });
        console.log("EDITAMOS save: " + req.load.scene.id)
        scene.save()
        res.redirect('/edit/' + req.load.scene.id);
    } catch (e) {
        console.log("ERROR: " + e)
    }
}



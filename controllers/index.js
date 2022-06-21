const { models } = require('../models');
//const createScene = require("../public/game/JUMICI/createScene");

const fs = require("fs");

// Autoload la escena asociado a :sceneId                                                           //Sin esto no coges los Id, legas a la página de grupos pero no puedes entrar en ninguno. Es muy importante en next.
// exports.load = async (req, res, next, sceneId) => {

//     try {
//         console.log(" PARAMS")
//         const scene = await models.Scene.findByPk(sceneId);
//         console.log(" OK1")
//         res.locals.load = scene;
//         if (scene) {
//             req.load = { ...req.load, scene };
//             console.log(" OK2")
//             console.log(" req:  " + req.load.scene.id)
//             next();
//         } else {
//             throw new Error('There is no scene with id=' + sceneId);
//         }
//     } catch (error) {
//         next(error);
//     }
// };

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
        console.log("DESABILITAMOS ESCENA: " + req.params.sceneId + "    otro:  " + req.params.sceneId + "    otro:  " + req.body.enabled + "    pruebaTrue:  " + !Boolean("true") + " kk sin comillas " + !false + " ll False " + !Boolean("false"))
        let scene = await models.Scene.findByPk(req.params.sceneId)
        if (scene.enabled === false) {
            scene.enabled = true;

        } else {
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
        console.log("BORRAMOS ESCENA: " + req.params.sceneId)
        let scene = await models.Scene.findByPk(req.params.sceneId)
        fs.unlinkSync('./public/game/JUMICI/scenes/' + scene.json)
        console.log('File removed')
        await scene.destroy();
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.showEdit = async (req, res, next) => {
    try {
        console.log("ACCEDEMOS A EDIT: " + req.params.sceneId)

        //For editing the card
        let images = fs.readdirSync("./public/images/app")
        let scene = await models.Scene.findByPk(req.params.sceneId)
        console.log(scene.json)
        const jsonAction = require("../public/game/JUMICI/scenes/" + scene.json);
        const json = require("../public/game/JUMICI/languages/" + jsonAction.language);
        
        let jsonIndex = [];
        for (let i = 0; i < jsonAction.actionKeys.length; i++) {
            if (jsonAction.actionKeys[i] === "activateTestView") {
                jsonIndex.push(jsonAction.actionArguments[i]);
            }
        }



        //For editing questions and answers
        let answer = true;
        let message = false;
        if (req.params.message === "true")
            message = true;
        console.log("truee no " + message);
        let correctAnswers = await models.Answer.findAll({ where: { game: scene.id } })
        res.render('edit', { scene, images, json, answer, message, correctAnswers, jsonIndex });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.edit = async (req, res, next) => {
    try {

        console.log("EDITAMOS ESCENA: " + req.params.sceneId)
        let scene = await models.Scene.findByPk(req.params.sceneId)
        console.log("name:  " + req.body.name)
        console.log("ruta:  " + req.body.image)
        console.log("desc" + req.body.description)

        //Check if there is already a game with that name
        let gameExist = await models.Scene.findOne({ where: { name: req.body.name } })
        console.log("FF " + gameExist);
        console.log(gameExist)
        if (gameExist && gameExist.id !== scene.id) {
            res.redirect('/edit/' + req.params.sceneId + "/true");
        } else {

            //Edit the game
            await scene.update({
                name: req.body.name,
                rutaImage: req.body.image,
                descripcion: req.body.description
            });
            console.log("EDITAMOS save: " + req.params.sceneId)
            //scene.save()
            res.redirect('/edit/' + req.params.sceneId);
        }
    } catch (e) {
        console.log("ERROR: " + e)
    }
}



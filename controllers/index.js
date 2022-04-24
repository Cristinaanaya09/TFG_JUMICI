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


        let directory_name = "./public/game/JUMICI/scenes";

        // Function to get current filenames
        // in directory
        let filenames = fs.readdirSync(directory_name);
        let images = fs.readdirSync("./public/images/app");

        console.log("\n Filenames in directory:");
        filenames.forEach((file) => {
            console.log("File:", file);
        });



        //Check if it's admin
        let admin;
        if (req.user.role === "PROFE")
            admin = true;

        res.render('index', { escenas, admin, filenames, show, images });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.crear = async (req, res, next) => {
    try {
        console.log("CREAMOS ESCENA")
        console.log("json: " + req.body.json)
        let image;

        //Check if there is anothe game with that json
        let jsonExist = await models.Scene.findOne({ where: { json: req.body.json } });
        if (jsonExist) {
            console.log("maal")
            res.redirect('createShow');
        }
        //Check if there is an image
        if (req.body.image.length === 0) {
            image = "images/app/ciberseguridad.jpg"
        } else {
            image = req.body.image;
        }

        //save game
        let game = {
            name: req.body.name,
            json: req.body.json,
            rutaImage: image,
            descripcion: req.body.description,
        }
        let directory_name = "./public/game/JUMICI/scenes";
        let filenames = fs.readdirSync(directory_name);
        let images = fs.readdirSync("./public/images/app");
let answer =true;
        await models.Scene.create(game);
        let scene = await models.Scene.findOne({ where: { json: req.body.json } });
        const jsonAction = require("../public/game/JUMICI/scenes/" + req.body.json);
        const json = require("../public/game/JUMICI/languages/" + jsonAction.language + '.json');
        res.render('create', { json, filenames, images, answer, scene });
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
        let images = fs.readdirSync("./public/images/app")
        let scene = await models.Scene.findByPk(req.load.scene.id)
        console.log(scene.json)
        const jsonAction = require("../public/game/JUMICI/scenes/" + scene.json);
        const json = require("../public/game/JUMICI/languages/" + jsonAction.language + '.json');
        console.log("jsonpars")
        let answer = true;
        res.render('edit', { scene, images, json, answer });
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



exports.kkk = async (req, res, next) => {
    try {
        await models.scene.findOne({ where: { id: req.load.scene.id } })
        const json = require("../public/game/JUMICI/languages/" + scene.json);
        let game = req.param.json;
        console.log("hola ESCENA")
        console.log("jsonpars")
        console.log(json)
        console.log("hol " + json.sceneArray.length)
        console.log(json.sceneArray[0].test)
        res.render('hola', { json, game });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.createShow = async (req, res, next) => {
    try {
        let directory_name = "./public/game/JUMICI/scenes";

        // Function to get current filenames
        // in directory
        let answer = false
        let filenames = fs.readdirSync(directory_name);
        let images = fs.readdirSync("./public/images/app");
        res.render('create', { filenames, images, answer });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
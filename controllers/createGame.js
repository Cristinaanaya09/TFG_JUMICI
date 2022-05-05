const fs = require("fs");
const { models } = require('../models');


exports.createShow = async (req, res, next) => {
    try {
        /*console.log("ENTRAMOS EN CREAAAAR")
        let directory_name = "./public/game/JUMICI/scenes";
        let answer = false;
        let message = false;
        
        let images = fs.readdirSync("./public/images/app");
        res.render('create', { filenames, images, answer, message });*/



        console.log("ENTRAMOS EN CREAAAAR")
        let directory_name = "./public/game/JUMICI/scenes";
        let answer = false;
        let message = false;
    

        let images = fs.readdirSync("./public/images/app");

        


        let filenames = [];

        fs.promises.readdir(directory_name).then( files => {
          files.forEach(file => {
                 filenames.push(file);
           });
           
        res.render('create', { filenames, images, answer, message }); 

        });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.crear = async (req, res, next) => {
    try {
        console.log("CREAMOS ESCENA")
        console.log("json: " + req.body.json)
        let image;
        let message = false;
        let answer =false;

        //For creating a new game
        let directory_name = "./public/game/JUMICI/scenes";
        let filenames = fs.readdirSync(directory_name);
        let images = fs.readdirSync("./public/images/app");

        const jsonAction = require("../public/game/JUMICI/scenes/" + req.body.json);
        const json = require("../public/game/JUMICI/languages/" + jsonAction.language + '.json');

        //Check if there is anothe game with that json
        let jsonExist = await models.Scene.findOne({ where: { json: req.body.json } });
        let nameExist = await models.Scene.findOne({ where: { name: req.body.name } });
        if (jsonExist || nameExist) {
            console.log("maal")
            message = true;
            res.render('create', { json, filenames, images, answer, message });
        }
        
        //Create new game
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
            enabled: req.body.enabled
        }
  
        answer =true;
       
        await models.Scene.create(game);
        let scene = await models.Scene.findOne({ where: { json: req.body.json } });
     
        res.render('create', { json, filenames, images, answer, scene, message });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.download = async (req, res, next) => {
    try {
        console.log("DOWNLOAD")
        console.log(req.body.name)
        console.log("file")
        console.log(req.body.file)

            fs.promises.writeFile('./public/game/JUMICI/scenes/'+req.body.name + '.json', req.body.file, err => {
                if (err) {
                  console.error(err)
                  return
                }
            }
            
            ).then(() => {
                res.redirect('/createShow');
            }
            )
          
        
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
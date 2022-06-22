const fs = require("fs");
const { models } = require('../models');
const multer = require('multer');
const { Console } = require("console");


exports.createShow = async (req, res, next) => {
    try {

        console.log("ENTRAMOS EN CREAAAAR")
    
        let scene;
        let json;
        let correctAnswers;

        //Dont show questions
        let answer = false;
        req.session.actions = [];
        req.session.write = false;
        req.session.dialog = [];
        console.log(req.params.question === "true")
        let jsonIndex = [];


        if (req.params.question === "true") {
            answer = true;
            if (req.params.json !== null || req.params.json !== undefined) {
                scene = await models.Scene.findOne({ where: { json: req.params.json } });
                correctAnswers = await models.Answer.findAll({ where: { game: scene.id } })
                const jsonAction = require("../public/game/JUMICI/scenes/" + req.params.json);
                json = require("../public/game/JUMICI/languages/" + jsonAction.language);
                for (let i = 0; i < jsonAction.actionKeys.length; i++) {
                    if (jsonAction.actionKeys[i] === "activateTestView") {
                        jsonIndex.push(jsonAction.actionArguments[i]);
                    }
                }
            }

            
           

        }

        console.log(answer);

        console.log(jsonIndex);

        let filenames=[];
        let directory_name = "./public/game/JUMICI/scenes";
        let filenamesTotal = fs.readdirSync(directory_name);
        let images = fs.readdirSync("./public/images/app");

        let jsons = await models.Scene.findAll({attributes: ["json"]})
        console.log("aquisee")

        let jsonsTot = [];
        for(let i = 0; i<jsons.length; i++){
             jsonsTot.push(jsons[i].json)
        }

        for(let i = 0; i<filenamesTotal.length; i++){
           if(!jsonsTot.includes(filenamesTotal[i]))
            filenames.push(filenamesTotal[i])
        }
        
        //No problem creating a scene
        let message = false;
        //YOU HAVE CREATE A JSON SCENE
        if (req.params.question === "iniciate") {
            message = "iniciate";
        }else if(req.params.question === "message") {
            message = true;
        }else if(req.params.question === "wrongImage"){
            message = "wrongImage";
        }

        res.render('create', { filenames, images, answer, message, scene, json, correctAnswers, jsonIndex});
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.crear = async (req, res, next) => {
    try {
        console.log("CREAMOS ESCENA")
        console.log("json: " + req.body.json)

        let image;

        //Check if there is another game with that json
        let jsonExist = await models.Scene.findOne({ where: { json: req.body.json } });
        let nameExist = await models.Scene.findOne({ where: { name: req.body.name } });
        if (jsonExist || nameExist) {
            console.log("maal")
            res.redirect('createShow/message')
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

        await models.Scene.create(game);
        res.redirect('createShow/true/'+req.body.json)

    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.download = async (req, res, next) => {
    try {
        console.log("DOWNLOAD")
        console.log(req.body.name)

        if (req.session.write) {
            let data = JSON.stringify(req.session.dialog);
            console.log("holita")
            fs.writeFile('./public/game/JUMICI/languages/' + req.body.name + '.json', data, err => {
                if (err) {
                    console.error(err)
                    return
                }
            }
            )
        }

        fs.writeFile('./public/game/JUMICI/scenes/' + req.body.name + '.json', req.body.file, err => {
            if (err) {
                console.error(err)
                return
            }
        }
        )
        console.log("TERMINA DOWNLOAD")
        res.send("OK")


    } catch (e) {
        console.log("ERROR: " + e)
    }
}



exports.deleteAction = async (req, res, next) => {
    try {
        console.log("deleteAction")
        console.log(req.body.index)
        console.log("COMPROBAR")
        console.log("length: " + req.session.actions.length)
        //console.log("REAL  " + JSON.parse(req.body.params));
        let action = req.session.actions[req.body.index];
        req.session.actions.splice(req.body.index, req.session.actions.length)
        console.log(action[0])
        if(action[0]==="start") {
            res.redirect("/indexCreate");
        }else if(action[0]==="loadCharacter") {
            res.redirect("/characterView")
        }else{
            res.redirect("/" + action[0] + "View")
        }
        

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.sendActions = async (req, res, next) => {
    try {
        console.log("sendAction")
        res.send(req.session.actions)

    } catch (e) {
        console.log("ERROR: " + e)
    }
}








exports.indexCreate = async (req, res, next) => {
    try {
        console.log("indexCreate")
        console.log(req.params.json)
        let jsonExist = false;

        console.log("JSON" + req.params.json)

        let jsonlanguage = fs.readdirSync("./public/game/JUMICI/languages")
        if (req.params.json === "write") {
            req.session.write = true;
        } else if (req.params.json) {
            jsonExist = true;
            req.session.json = req.params.json;
        }
        console.log(jsonExist)
        let write = req.session.write;
        let actions = req.session.actions;
        res.render("createGame/indexCreate", { jsonlanguage, jsonExist, write, actions })

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.createJSON = async (req, res, next) => {
    try {
        console.log("createPOST")
        console.log(req.body.name)
        console.log(req.body.json)
        let json;
        if (req.body.json) {
            json = req.body.json;
        } else {
            json = req.body.name + ".json";
        }
        req.session.actions.push(["start", req.body.name, json]);
        res.redirect("/indexCreate/" + json)
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

//GET background
exports.backgroundView = async (req, res, next) => {
    try {
        console.log("backgroundVIEW")

        let backgroundImages = fs.readdirSync("./public/game/images/backgrounds")
        let actions = req.session.actions;
        if (req.session.write) {
            jsonFile = req.session.dialog;
        } else {
            jsonFile = require("../public/game/JUMICI/languages/" + req.session.json);
        }

        let message = req.flash('messages')[0];
        let success = req.flash('success')[0];
        console.log(message)
        res.render("createGame/background", { backgroundImages, actions, jsonFile, message, success })
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


//POST background
exports.background = async (req, res, next) => {
    try {
        console.log("background");
        console.log(req.body.background);
        req.session.actions.push(["background", req.body.background]);

        res.redirect("/characterView");

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


//GET character
exports.characterView = async (req, res, next) => {
    try {
        console.log("characterVIEW")
        let characterImages = fs.readdirSync("./public/game/images/characters")
        let actions = req.session.actions;
        let jsonFile;
        let number = 0;
        let success = req.flash('success')[0];
        let message = req.flash('messages')[0];
        if (req.query.number) {
            number = req.query.number;
        }
        if (number === "none") {
            res.redirect("/dialogView")
        } else {
            if (req.session.write) {
                jsonFile = req.session.dialog;
            } else {
                jsonFile = require("../public/game/JUMICI/languages/" + req.session.json);
            }
            res.render("createGame/character", { characterImages, actions, jsonFile, number, message, success })
        }
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

//POST character
exports.loadCharacter = async (req, res, next) => {
    try {
        console.log("character");
        console.log(req.body.character);
        console.log(req.body.position);
        console.log("character2");
        console.log(req.body.character2);
        console.log(req.body.position2);

        let params = [1, req.body.character, req.body.position];

        if (req.body.position2) {
            params = [2, req.body.character, req.body.position, req.body.character2, req.body.position2];
            req.session.actions.push(["loadCharacter", params]);
        } else {
            req.session.actions.push(["loadCharacter", params]);
        }

        res.redirect("/dialogView");


    } catch (e) {
        console.log("ERROR: " + e)
    }
}


//GET dialog
exports.dialogView = async (req, res, next) => {
    try {
        console.log("dialogVIEW")
        console.log("JSON" + req.params.json)

        let characterImages = fs.readdirSync("./public/game/images/characters")
        let backgroundImages = fs.readdirSync("./public/game/images/backgrounds")
        let jsonFile;

        let actions = req.session.actions;

        if (req.session.write) {
            console.log("write")
            jsonFile = req.session.dialog;
            res.render("createGame/2option/dialog", { characterImages, actions, jsonFile })
        } else {
            jsonFile = require("../public/game/JUMICI/languages/" + req.session.json);
            res.render("createGame/dialog", { jsonFile, characterImages, actions, backgroundImages })
        }

    } catch (e) {
        console.log("ERROR: " + e)
        res.send("ERROR in DialogView: " + e)
    }
}


//POST
exports.dialog = async (req, res, next) => {
    try {
        console.log("dialog")
        console.log(req.body.page)
        console.log(req.body.character)
        console.log(req.body.message)
        console.log(req.body.message2)

        let scene1;
        let dialog1;
        let scene2;
        let dialog2;

        if(req.session.write){
            //COMPROBAR SI CREAS POR PRIMERA VEZ UN DIALOG
            if (req.session.dialog.length === 0) {
                req.session.dialog = {
                    sceneArray: [{
                        dialog: [{
                            speaker: req.body.speaker,
                            message: req.body.message
                        }],
                        test:[],
                    }]
                }
                scene1 = req.session.dialog.sceneArray.length - 1;
                dialog1 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                console.log(req.session.dialog)
                console.log(req.session.dialog.sceneArray[0])

                if (req.body.speaker2) {
                    let dialog = {
                        speaker: req.body.speaker2,
                        message: req.body.message2
                    };
                    console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog)
                    req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog.push(dialog);
                    scene2 = req.session.dialog.sceneArray.length - 1;
                    dialog2 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                }

            //SI YA HAY UN TEST O DIALOG CREADOS
            } else {
                console.log("hahaha")
                //COMPROBAR SI HAY QUE CREAR UNA ESCENA NUEVA
                if (req.session.actions[req.session.actions.length - 2][0] === "background") {
                    let sceneArray =
                        {
                            dialog: [{
                                speaker: req.body.speaker,
                                message: req.body.message
                            }],
                            test:[]
                        };
                    req.session.dialog.sceneArray.push(sceneArray);
                    console.log("dentroif")
                    scene1 = (req.session.dialog.sceneArray.length - 1);
                    console.log("dentroif2")
                    console.log(scene1)
                    console.log(req.session.dialog.sceneArray[scene1].dialog)
                    dialog1 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                    console.log("dentroif3")

                    //SI HAY UN SEGUNDO PERSONAJE
                    if (req.body.speaker2) {
                        let dialog = {
                            speaker: req.body.speaker2,
                            message: req.body.message2
                        };

                        req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog.push(dialog);
                        scene2 = req.session.dialog.sceneArray.length - 1;
                        dialog2 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                    }

                //EN LA MISMA ESCENA DE ANTES
                } else {
                    let dialog = {
                        speaker: req.body.speaker,
                        message: req.body.message
                    };
                    console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog)
                    req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog.push(dialog);
                    scene1 = req.session.dialog.sceneArray.length - 1;
                    dialog1 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                    if (req.body.speaker2) {
                        let dialog = {
                            speaker: req.body.speaker2,
                            message: req.body.message2
                        };
                        console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog)
                        req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].dialog.push(dialog);
                        scene2 = req.session.dialog.sceneArray.length - 1;
                        dialog2 = req.session.dialog.sceneArray[scene1].dialog.length - 1;
                    }
                }
            }
        }

        console.log(req.session.dialog)
        let position = "none";

        console.log(req.session.actions[req.session.actions.length - 1][1][1])

        if (req.session.actions[req.session.actions.length - 1][1][1] === req.body.character)
            position = req.session.actions[req.session.actions.length - 1][1][2];

        console.log("antess " + req.session.actions[req.session.actions.length - 1][1][1])
        console.log("iguak " + req.body.character)
        console.log("pos1 " + position)

        if (!req.session.write) {
            if(req.body.message){
                let params = [position, req.body.message[0], req.body.message[1]];

                if (req.body.message2) {
                    let position2 = req.session.actions[req.session.actions.length - 1][1][4];
                    if (position === "none") {
                        position = req.session.actions[req.session.actions.length - 1][1][4];
                        position2 = req.session.actions[req.session.actions.length - 1][1][2];
                    }
                    params = [position, req.body.message[0], req.body.message[1], position2, req.body.message2[0], req.body.message2[1]];
                    console.log("PARAMS1 " + params)
                    req.session.actions.push(["dialog", params]);
                } else {
                    console.log("PARAMS2 " + params)
                    req.session.actions.push(["dialog", params]);
                }
            }
        } else {
            let params = [position, scene1, dialog1];
            if (req.body.message2) {
                let position2 = req.session.actions[req.session.actions.length - 1][1][4];
                if (position === "none") {
                    position = req.session.actions[req.session.actions.length - 1][1][4];
                    position2 = req.session.actions[req.session.actions.length - 1][1][2];
                }
                params = [position, scene1, dialog1, position2, scene2, dialog2];
                console.log("PARAMS3 " + params)
                req.session.actions.push(["dialog", params]);
            } else {
                console.log("PARAMS4 " + params)
                req.session.actions.push(["dialog", params]);
            }

        }


        console.log("posfinal " + position)
        console.log("finaalPP:  " + req.body.final)
        if (req.body.final) {
            console.log("finaal")
            res.send("OK")
        }
        if (req.body.page === "dialogView") {
            if (req.session.actions[req.session.actions.length - 2][0] === "loadCharacter" && req.session.actions[req.session.actions.length - 1][1][0] !== "none")
                req.session.actions.push(req.session.actions[req.session.actions.length - 2]);
            res.redirect("/dialogView")
        }
        if (req.body.page === "characterView") {
            res.redirect("/characterView")
        }
        if (req.body.page === "backgroundView") {
            res.redirect("/backgroundView")
        }
        if (req.body.page === "testView") {
            res.redirect("/testView")
        }
    } catch (e) {
        console.log("ERROR: " + e)
        res.send("ERROR: " + e)
    }
}


//GET test
exports.testView = async (req, res, next) => {
    try {
        console.log("testVIEW")
        let jsonFile;
        console.log("JSON" + req.params.json)

        let actions = req.session.actions;
        if (req.session.write) {
            jsonFile = req.session.dialog;
            res.render("createGame/2Option/test", { actions, jsonFile })
        } else {
            jsonFile = require("../public/game/JUMICI/languages/" + req.session.json);
            res.render("createGame/test", { jsonFile, actions })
        }




    } catch (e) {
        console.log("ERROR EN TEST VIEW: " + e);
        res.send("ERROR EN TEST VIEW: " + e)
    }
}

exports.test = async (req, res, next) => {
    try {
        console.log("test")
        console.log(req.body.test)
        console.log(req.body.final)

        if (req.body.test || (req.body.question && req.body.a && req.body.b && req.body.c && req.body.d)) {
            console.log("Entran")
            let params = [];
            if (req.session.write) {
                if (req.session.dialog.length === 0) {
                    req.session.dialog = {
                        sceneArray: [{
                            dialog: [],
                            test: [{
                                question: req.body.question,
                                a: req.body.a,
                                b: req.body.b,
                                c: req.body.c,
                                d: req.body.d,
                            }]
                        }]
                    }
                } else {
                    console.log("else")
                    console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].test)
                        
                        let test = {
                            question: req.body.question,
                            a: req.body.a,
                            b: req.body.b,
                            c: req.body.c,
                            d: req.body.d,
                        };
                    console.log("1")
                    console.log(req.session.dialog)
                    console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1])
                    console.log(req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].test)
                    req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].test.push(test);
                    console.log("2")
                    

                }
                params=[req.session.dialog.sceneArray.length - 1, req.session.dialog.sceneArray[req.session.dialog.sceneArray.length - 1].test.length-1];
            
            }else{
                console.log("tipo 2 option")
                params = [req.body.test[0], req.body.test[1]]
            }

            req.session.actions.push(["test", params]);
        }
            if (req.body.final)
                res.redirect("/finalView")
            if (req.body.page === "dialogView") {
                res.redirect("/backgroundView")
            }
            if (req.body.page === "testView") {
                res.redirect("/testView")
            }
        res.send("OK")
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.finalView = async (req, res, next) => {
    try {
        console.log("finaal")
        let jsonFile;
        if (req.session.write) {
            console.log("write")
            jsonFile = req.session.dialog;
        } else {
            jsonFile = require("../public/game/JUMICI/languages/" + req.session.json);
        }


        let actions = req.session.actions;
        res.render("createGame/final", { jsonFile, actions })

    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.final = async (req, res, next) => {
    try {
        console.log("final")
        console.log(req.body.page)

        if (req.body.page === "test")
            res.redirect("/testView")
        if (req.body.page === "dialog") {
            res.redirect("/backgroundView")
        }
    } catch (e) {
        console.log("ERROR: " + e)
    }
}









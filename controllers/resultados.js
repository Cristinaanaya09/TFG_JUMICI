
const { models } = require('../models');

exports.resultados = async (req, res, next) => {
    try {
        console.log("RESULTADO")

        let answers = await models.UserAnswer.findAll(); //Se guardan las respuestas por usuario
        let list = [];
        for (let answer of answers) {
            let x = await models.UserAnswer.findAll({ where: { user: answer.user, game: answer.game, attempt: answer.attempt } });
            if (list.length === 0)
                list.push(x);
            else {
                for (let i = 0; i < list.length; i++) {
                    if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                        break;
                    } else if (i === list.length - 1)
                        list.push(x);
                }
            }

        }




        let scenes = await models.Scene.findAll();
        let users = await models.User.findAll();

        /******CORRECT ANSWERS******/
        let corrects = [];
        for (let answer of list) {
            let n = 0;
            for (let i = 0; i < answer.length; i++) {
                if (answer[i].correct === 1) {
                    ++n;
                }
                let game = await models.Scene.findOne({ where: { id: answer[i].game } })
                const jsonAction = require("../public/game/JUMICI/scenes/" + game.json);
                const json = require("../public/game/JUMICI/languages/" + jsonAction.language);
                let totalGame = 0;
                let jsonIndex = [];
                for (let i = 0; i < jsonAction.actionKeys.length; i++) {
                    if (jsonAction.actionKeys[i] === "activateTestView") {
                        jsonIndex.push(jsonAction.actionArguments[i]);
                    }
                }
                if (i === answer.length - 1) {
                    let m = {
                        total: n,
                        user: answer[i].user,
                        scene: answer[i].game,
                        totalGame: jsonIndex.length,
                        attempt: answer[i].attempt
                    }
                    corrects.push(m);
                }
            }
        }


        res.render('resultados', { list, users, scenes, corrects });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.filter = async (req, res, next) => {
    try {
        console.log("FILTER");
        let filter;
        let scenes;
        let game = await models.Scene.findAll({ where: { name: req.body.scene } });
        let answers = await models.UserAnswer.findAll(); //Se guardan las respuestas por usuario
        let sceneId;
        let list = [];
        console.log("scenes:  " + typeof scenes);
        console.log("hola:  " + scenes);
        console.log("hola:  " + game.length);

        /* SCENE */
        if (game === null || game.length === 0)
            scenes = await models.Scene.findAll();
        else {
            scenes = await models.Scene.findAll({ where: { name: req.body.scene } });
            sceneId = scenes[0].id;
        }

        /* USER */
        let userId;
        let users;
        console.log("user: " + typeof req.body.user);
        console.log("esta vacio: " + req.body.user === "" + " logitud: " + req.body.user.length + " esta vacio comprob length: " + req.body.user.length !== 0);

        /* user: user*/
        let user = await models.User.findAll({ where: { name: req.body.user } });
        if (user !== null && user !== undefined && user.length !== 0) {
            console.log("HAY USER");
            users = await models.User.findAll({ where: { name: req.body.user } });
            console.log("user: " + typeof users);
            userId = users[0].id;

            /*scene: null, user: user*/
            if (game.length === 0)

                for (let answer of answers) {
                    let x = await models.UserAnswer.findAll({ where: { user: userId, game: answer.game, attempt: answer.attempt } });
                    if (list.length === 0)
                        list.push(x);
                    else {
                        for (let i = 0; i < list.length; i++) {
                            if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                                break;
                            } else if (i === list.length - 1)
                                list.push(x);
                        }
                    }

                }

            /* user: null*/
        } else {
            console.log("NO HAY USER")
            users = await models.User.findAll();
            console.log("USER: " + game.length)

            /*scene: scene, user: null*/
            if (game.length !== 0) {
                console.log("mal: ")
                for (let answer of answers) {
                    let x = await models.UserAnswer.findAll({ where: { user: answer.user, game: sceneId, attempt: answer.attempt } });
                    if (list.length === 0)
                        list.push(x);
                    else {
                        for (let i = 0; i < list.length; i++) {
                            if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                                break;
                            } else if (i === list.length - 1)
                                list.push(x);
                        }
                    }

                }
            }
        }

        console.log("FILTER: esenaId: " + sceneId + "Id:user " + userId);

        /*scene: scene, user: user*/
        if (sceneId !== undefined && userId !== undefined) {
            console.log("FILTER: esenaId: " + sceneId + "Id:user " + userId);
            for (let answer of answers) {
                let x = await models.UserAnswer.findAll({ where: { user: userId, game: sceneId, attempt: answer.attempt } });
                if (list.length === 0)
                    list.push(x);
                else {
                    for (let i = 0; i < list.length; i++) {
                        if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                            break;
                        } else if (i === list.length - 1)
                            list.push(x);
                    }
                }

            }
            total = list.length


        } else if (sceneId === undefined && userId === undefined) {
            for (let answer of answers) {
                let x = await models.UserAnswer.findAll({ where: { user: answer.user, game: answer.game, attempt: answer.attempt } });
                if (list.length === 0)
                    list.push(x);
                else {
                    for (let i = 0; i < list.length; i++) {
                        if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                            break;
                        } else if (i === list.length - 1)
                            list.push(x);
                    }
                }

            }
        }

        /******CORRECT ANSWERS******/
        let corrects = [];
        for (let answer of list) {
            let n = 0;
            for (let i = 0; i < answer.length; i++) {
                if (answer[i].correct === 1) {
                    ++n;
                }
                let game = await models.Scene.findOne({ where: { id: answer[i].game } })
                const jsonAction = require("../public/game/JUMICI/scenes/" + game.json);
                const json = require("../public/game/JUMICI/languages/" + jsonAction.language);
                let totalGame = 0;
                let jsonIndex = [];
                for (let i = 0; i < jsonAction.actionKeys.length; i++) {
                    if (jsonAction.actionKeys[i] === "activateTestView") {
                        jsonIndex.push(jsonAction.actionArguments[i]);
                    }
                }
                if (i === answer.length - 1) {
                    let m = {
                        total: n,
                        user: answer[i].user,
                        scene: answer[i].game,
                        totalGame: jsonIndex.length,
                        attempt: answer[i].attempt
                    }
                    corrects.push(m);
                }
            }
        }
        res.render('resultados', { list, users, scenes, corrects });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.gameResults = async (req, res, next) => {
    try {
        console.log("results por juego");

        let list = [];
        let answers = await models.UserAnswer.findAll(); //Se guardan las respuestas por usuario

        /* ANSWERS OF THE GAME */
        for (let answer of answers) {
            let x = await models.UserAnswer.findAll({ where: { user: answer.user, game: req.params.sceneId, attempt: answer.attempt } });
            if (list.length === 0)
                list.push(x);
            else {
                for (let i = 0; i < list.length; i++) {
                    if (JSON.stringify(list[i]) === JSON.stringify(x)) {
                        break;
                    } else if (i === list.length - 1)
                        list.push(x);
                }
            }

        }

        let scenes = await models.Scene.findAll({ where: { id: req.params.sceneId } });

        /* USER FOR FILTER */
        let users = await models.User.findAll();

        /******CORRECT ANSWERS******/
        let corrects = [];
        for (let answer of list) {
            let n = 0;
            for (let i = 0; i < answer.length; i++) {
                if (answer[i].correct === 1) {
                    ++n;
                }
                let game = await models.Scene.findOne({ where: { id: answer[i].game } })
                const jsonAction = require("../public/game/JUMICI/scenes/" + game.json);
                const json = require("../public/game/JUMICI/languages/" + jsonAction.language);
                let totalGame = 0;
                let jsonIndex = [];
                for (let i = 0; i < jsonAction.actionKeys.length; i++) {
                    if (jsonAction.actionKeys[i] === "activateTestView") {
                        jsonIndex.push(jsonAction.actionArguments[i]);
                    }
                }
                if (i === answer.length - 1) {
                    let m = {
                        total: n,
                        user: answer[i].user,
                        scene: answer[i].game,
                        totalGame: jsonIndex.length,
                        attempt: answer[i].attempt
                    }
                    corrects.push(m);
                }
            }
        }

        res.render('resultados', { list, users, scenes, corrects });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}



exports.graphics = async (req, res, next) => {
    try {
        console.log("graphics");

        let game = await models.Scene.findOne({ where: { json: req.params.json } });
        const jsonAction = require("../public/game/JUMICI/scenes/" + req.params.json);
        json = require("../public/game/JUMICI/languages/" + jsonAction.language);
        let options = [];
        let list = [];


        let index = [];
        let jsonIndex = [];
        for (let i = 0; i < jsonAction.actionKeys.length; i++) {
            if (jsonAction.actionKeys[i] === "activateTestView") {
                index.push(i);
                jsonIndex.push(jsonAction.actionArguments[i]);
            }
        }


        for (let i = 0; i < jsonIndex.length; i++) {
            let scene = jsonIndex[i][0];
            let question = jsonIndex[i][1];

            //GRAPHIC_1

            let maxAttempt = await models.UserAnswer.max('attempt', {where: { scene: scene, question: question, game: game.id }});
            
            console.log(game.id)
            console.log("mmmmm");
            console.log(maxAttempt);
            
            let answers =  [];
            for(let m = 1; m <= maxAttempt; m++){
                let ok = await models.UserAnswer.findAll({
                    where: { scene: scene, question: question, game: game.id, correct: 1, attempt: m }
                });
                console.log('ok')
                console.log(ok.length)
                let x = await models.UserAnswer.findAll({
                    where: { scene: scene, question: question, game: game.id, correct: 0, attempt: m }
                });
                answers.push([ok.length, x.length])
            }
            console.log(answers)
            list.push(answers);
            
            let correct = await models.Answer.findOne({ where: { game: game.id, scene: scene, question: question} }); 
            if(correct===null){
                correct="none"
            }
            else{
                correct=correct.answer;
            }
            //console.log(correct.answer)
            // GRAPHIC_2 
            let a = await models.UserAnswer.findAll({ where: { game: game.id, scene: scene, question: question, answer: 'A' } });
            let b = await models.UserAnswer.findAll({ where: { game: game.id, scene: scene, question: question, answer: 'B' } });
            let c = await models.UserAnswer.findAll({ where: { game: game.id, scene: scene, question: question, answer: 'C' } });
            let d = await models.UserAnswer.findAll({ where: { game: game.id, scene: scene, question: question, answer: 'D' } });

            options.push([game, scene, question, a.length, b.length, c.length, d.length, correct])
        }


        console.log(list.length)
        console.log(options.length)
        console.log(list.length === options.length)
        //let answers = await models.UserAnswer.findAll(); //Se guardan las respuestas por usuario

        res.render('graphics', { options, json, list });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


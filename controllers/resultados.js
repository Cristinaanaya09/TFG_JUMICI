const { where } = require('sequelize/dist');
const { models } = require('../models');

exports.resultados = async (req, res, next) => {
    try {
        console.log("RESULTADO")
       
        let list = await models.UserAnswer.findAll();; //Se guardan las respuestas por usuario
      
        /*Sav corrects for user */
        let corrects = [];
        let users = await models.User.findAll();
        for (let user of users) {
            let totalAns = await models.UserAnswer.findAll({ where: { user: user.id, correct: 1 } });
            let total = {
                total: totalAns.length,
                user: user.id
            }
            corrects.push(total);
        }
        let scenes = await models.Scene.findAll();

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
                list = await models.UserAnswer.findAll({ where: { user: userId } });

            /* user: null*/
        } else {
            console.log("NO HAY USER")
            users = await models.User.findAll();
            console.log("USER: " + game.length)

            /*scene: scene, user: null*/
            if (game.length !== 0){
                console.log("mal: ")
                list = await models.UserAnswer.findAll({ where: {game: sceneId } });
            }
        }

        console.log("FILTER: esenaId: " + sceneId + "Id:user " + userId);

        /*scene: scene, user: user*/
        if (sceneId !== undefined && userId !== undefined) {
            console.log("FILTER: esenaId: " + sceneId + "Id:user " + userId);
            list = await models.UserAnswer.findAll({ where: { game: sceneId, user: userId } });
            total = list.length


        } else if (sceneId === undefined && userId === undefined) {
            list = await models.UserAnswer.findAll();
        }


        /*Sav corrects for user */
        let corrects = [];
        for (let person of users) {
            let totalAns = await models.UserAnswer.findAll({ where: { user: person.id, correct: 1 } });
            let total = {
                total: totalAns.length,
                user: person.id
            }
            corrects.push(total);
        }

        res.render('resultados', { list, users, scenes, corrects });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.gameResults = async (req, res, next) => {
    try {
        console.log("results por juego");



        /* ANSWERS OF THE GAME */
        let list = await models.UserAnswer.findAll({ where: { game: req.params.sceneId } });

        let scenes = await models.Scene.findAll({ where: { id: req.params.sceneId } });

        /* USER FOR FILTER */
        let users = await models.User.findAll();

        /* CALCULATE TOTAL CORRECTS */
        let corrects = [];
        for (let user of users) {
            let totalAns = await models.UserAnswer.findAll({ where: { user: user.id, correct: 1 } });
            let total = {
                total: totalAns.length,
                user: user.id
            }
            corrects.push(total);
        }

        res.render('resultados', { list, users, scenes, corrects });

    } catch (e) {
        console.log("ERROR: " + e)
    }
}


const { where } = require('sequelize/dist');
const { models } = require('../models');

exports.resultados = async (req, res, next) => {
    try {
        console.log("RESULTADO")
        let respuestas = await models.UserAnswer.findAll();
        let lista = []; //Se guardan las respuestas por usuario
        let answer;

        for (let respuesta of respuestas) {
            console.log("id usuario: " + respuesta.user);
            let user = await models.User.findOne({ where: { id: respuesta.user } });
            answer = {
                correo: user.email,
                username: user.name,
                pregunta: respuesta.question,
                respuesta: respuesta.answer,
                correct: respuesta.correct,
                time: respuesta.time,
                date: respuesta.updatedAt,
            }
            lista.push(answer)
        }

        /*Sav corrects for user */
        let corrects = [];
        let users = await models.User.findAll();
        for(let user of users){
            let totalAns = await models.UserAnswer.findAll({ where: { user: user.id, correct: 1} });
            let total = {
                total: totalAns.length,
                user: user.id
            } 
            corrects.push(total);
        }
        let escenas = await models.Scene.findAll();
        
        res.render('resultados', { lista, users, escenas, corrects });
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


exports.filter = async (req, res, next) => {
    try {
        console.log("FILTER");
        let filter;
        let escenas = await models.Scene.findOne({where: {name: req.body.scene}});
        let escenaId;
        let user;
        let total;
        
        /* SCENE */ 
        if(escenas===null)
            escenas = await models.Scene.findAll();
        else{
            escenaId = escenas.id;
        }

        /* USER */ 
        let userId;
        console.log("user: " + typeof req.body.user);
        console.log("esta vacio: " +  req.body.user==="");
        console.log("logitud: " +  req.body.user.length);
        console.log("esta vacio comprob length: " +  req.body.user.length!==0);

        if(req.body.user!==null && req.body.user!==undefined && req.body.user.length !== 0){
            console.log("IF USER");
            user = await models.User.findOne({where: {name: req.body.user}});
            userId = user.id;

            /*scene: null, user: user*/
            if(escenas===null)
                filter = await models.UserAnswer.findAll({where: {user: userId}});
            
        }else{
            console.log("ENTRAMOS EN ELSE USER")
            user = await models.User.findAll();
            console.log("uSER: " + user)

             /*scene: scene, user: null*/
            if(escenas!==null)
                filter = await models.UserAnswer.findAll({where: {scene: escenaId}});
        }

        /* DATE */
        if(req.body.date!==null)
            date = new Date(req.body.date);

        /*scene: scene, user: user*/
        if(escenaId!==undefined && userId!==undefined){
            console.log("FILTER: esenaId: " + escenaId + "Id:user " + userId + "date: " + req.body.date);
            filter = await models.UserAnswer.findAll({where: {scene: 0, user: userId}});
            let totalAns = await models.UserAnswer.findAll({where: {scene: 0, user: userId, correct: 1} });
            total = totalAns.length
        }
        console.log(filter)
        res.render('filter', {filter, user, escena, total});
    } catch (e) {
        console.log("ERROR: " + e)
    }
}


const { models } = require('../models');

exports.seguimiento = async (req, res, next) => {
    try {
        console.log("SEGUIR ALUMNO Y GUARDAR RESPUESTA")
        console.log("id usuario: " + req.user.id);
        let correct=0;
        let correctAnswer = await models.Answer.findOne({ where: { 
                                                            scene: parseInt(req.body.sceneNumber),
                                                            question: parseInt(req.body.testNumber),
                                                        } });
        console.log("Existe respCORRECTA: " + correctAnswer)
        let scene = await models.Scene.findOne({ where: {json: req.params.json}});
       
        console.log("IDESCENA: " + req.params.json)
        if(correctAnswer!==null)
            if (correctAnswer.answer === req.body.id)
                correct = 1;
    console.log("correcto: " + correct)
        let respuesta = {
            game: scene.id,
            scene: req.body.sceneNumber,
            user: req.user.id,
            question: parseInt(req.body.testNumber),
            answer: req.body.id,
            time: req.body.time,
            correct: correct,
        }

        console.log("RESPUESTA ALUMNO " + respuesta)
        await models.UserAnswer.create(respuesta);
        res.end();
    } catch (e) {
        console.log("ERROR: " + e)
    }

}

exports.escenas = async (req, res, next) => {
    try {
        console.log("ESCENA")
        console.log("escenaaa cargada: " + req.load.scene)
        /*let scene = await models.Scene.findAll({where: {name: req.body.name}});
        if(scene!==null)
            await models.Scene.create(req.body);*/
        res.end();
    } catch (e) {
        console.log("ERROR: " + e)
    }

}

exports.answers = async (req, res, next) => {
    try {
        let game = await models.Scene.findOne({where:{json: req.params.json}})
        console.log("respuuuuuuu")
        console.log("resp: " + req.body.answer)

        //Check if there is already a saved answer
        let answerExist = await models.Answer.findOne({where:{game: game.id, scene: req.body.scene, question: req.body.question}})
        if(answerExist){
            console.log("answerExist")
            answerExist.update({
                game: game.id,
                scene: req.body.scene,
                question: req.body.question,
                answer: req.body.answer,
            });
            res.redirect('/edit/'+game.id);
        }
        else{

        //Create answer
        let correctAnswer = {
            game: game.id,
            scene: req.body.scene,
            question: req.body.question,
            answer: req.body.answer,
        }

        await models.Answer.create(correctAnswer);
        res.redirect('/edit/'+game.id);
    }
    } catch (e) {
        console.log("ERROR: " + e)
    }

}

exports.final = async (req, res, next) => {
    try {
        console.log("Final!!")
        res.redirect('index');
    } catch (e) {
        console.log("ERROR: " + e)
    }

}


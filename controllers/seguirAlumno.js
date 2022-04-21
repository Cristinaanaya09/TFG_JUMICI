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
        console.log("param: " + req.params.sceneId)
        console.log("escenaaa: " + req.load.scene.id)
        if(correctAnswer!==null)
            if (correctAnswer.answer === req.body.id)
                correct = 1;
    console.log("correcto: " + correct)
        let respuesta = {
            scene: req.load.scene.id,
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
        /*console.log("respuuuuuuu")
        let correctAnswer = {
            scene: 0,
            question: 0,
            answer: 'B',
        }
        await models.Answer.create(correctAnswer);*/
        res.end();
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


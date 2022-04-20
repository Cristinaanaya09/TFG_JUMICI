const { models } = require('../models');

exports.seguimiento = async (req, res, next) => {
    try {
        console.log("SEGUIR ALUMNO")
        console.log("id usuario: " + req.user.id);
        let correct=0;
        let correctAnswer = await models.Answer.findOne({ where: { 
                                                            scene: parseInt(req.body.sceneNumber),
                                                            question: parseInt(req.body.testNumber),
                                                        } });
        console.log("respCORRECTA: " + correctAnswer)
        if(correctAnswer!==null)
            if (correctAnswer.answer === req.body.id)
                correct = 1;
    console.log("correcto: " + correct)
        let respuesta = {
            scene: parseInt(req.body.sceneNumber),
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
        let scene = await models.Scene.findAll({where: {name: req.body.name}});
        if(scene!==null)
            await models.Scene.create(req.body);
        res.end();
    } catch (e) {
        console.log("ERROR: " + e)
    }

}

exports.answers = async (req, res, next) => {
    try {
        console.log("respuuuuuuu")
        let correctAnswer = {
            scene: 0,
            question: 0,
            answer: 'B',
        }
        await models.Answer.create(correctAnswer);
        res.end();
    } catch (e) {
        console.log("ERROR: " + e)
    }

}

exports.final = async (req, res, next) => {
    try {
        console.log("Final!!")
        res.redirect('/index');
    } catch (e) {
        console.log("ERROR: " + e)
    }

}


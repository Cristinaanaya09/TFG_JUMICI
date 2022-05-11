
const { models } = require('../models');

exports.game = async (req, res, next) => {
    try {
        console.log("GAME")

        let scene = await models.Scene.findOne({ where: {json: req.params.json}});
        let answer = await models.UserAnswer.findAll({ where: { 
            game: scene.id,
        } });
        //console.log("req.load.scene: " + req.load.scene.id)
        console.log(answer[answer.length-1])
        if(answer[answer.length-1]!==undefined)
            req.session.attempt = answer[answer.length-1].attempt +1;
        else{
            req.session.attempt = 1;
        }
        console.log("attempt: " + req.session.attempt)
        res.render('game')
    } catch (e) {
        console.log("ERROR: " + e)
    }
}

exports.mm = async (req, res, next) => {
    try {
        console.log("GAME")
        //console.log("req.load.scene: " + req.load.scene.id)
        
        res.render('game')
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
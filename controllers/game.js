
const { models } = require('../models');

exports.game = async (req, res, next) => {
    try {
        console.log("GAME")
        //console.log("req.load.scene: " + req.load.scene.id)
        
        res.render('game')
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
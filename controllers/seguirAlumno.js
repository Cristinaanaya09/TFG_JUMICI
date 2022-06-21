const { models } = require('../models');

exports.seguimiento = async (req, res, next) => {
    try {
        console.log("SEGUIR ALUMNO Y GUARDAR RESPUESTA")

        let correct=0;
        let attemptcount =1;

       
        let scene = await models.Scene.findOne({ where: {json: req.params.json}});

        //Correct answer
        let correctAnswer = await models.Answer.findOne({ where: { 
            game: scene.id,
            scene: parseInt(req.body.sceneNumber),
            question: parseInt(req.body.testNumber),
        }});
        console.log("Existe respCORRECTA: " + correctAnswer)


        if(correctAnswer!==null)
        if (correctAnswer.answer === req.body.id)
            correct = 1;
/*
         //Check if it is already answer
         let answer = await models.UserAnswer.findAll({ where: { 
            game: scene.id,
            user: req.user.id,
            scene: parseInt(req.body.sceneNumber),
            question: parseInt(req.body.testNumber),
        } });
        console.log("IDESCENA: " + answer)
        if(answer.length!==0){
            attemptcount =answer[answer.length-1].attempt +1;
            
            console.log("tt " + req.session.attempt)
            console.log("mm " + req.session)
            console.log("mm ")
            console.log("vv " + attemptcount)
        }
        console.log("IDESCENA: " + req.params.json)

        */
      
        let respuesta = {
            game: scene.id,
            scene: req.body.sceneNumber,
            user: req.user.id,
            attempt: req.session.attempt,
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

// exports.escenas = async (req, res, next) => {
//     try {
//         console.log("ESCENA")
//         console.log("escenaaa cargada: " + req.load.scene)
//         /*let scene = await models.Scene.findAll({where: {name: req.body.name}});
//         if(scene!==null)
//             await models.Scene.create(req.body);*/
//         res.end();
//     } catch (e) {
//         console.log("ERROR: " + e)
//     }

// }

exports.answers = async (req, res, next) => {
    try {
        console.log("resp: " + req.params.type + "  hehhehe " + req.params.json)
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
        } else{

            //Create answer
            let correctAnswer = {
                game: game.id,
                scene: req.body.scene,
                question: req.body.question,
                answer: req.body.answer,
            }

            await models.Answer.create(correctAnswer);
        }

            //Update answers from users
            let userAnswers = await models.UserAnswer.findAll({where:{game: game.id, scene: req.body.scene, question: req.body.question}})
            for(let userAnswer of userAnswers){
                if(userAnswer.answer === req.body.answer) {
                    userAnswer.correct = 1; 
                    userAnswer.save();         
                }else{
                    userAnswer.correct = 0; 
                    userAnswer.save();       
                }
            } 
    
        if(req.params.type === "create" )
            res.redirect('/createShow/true/' +  req.params.json);
        res.redirect('/edit/'+game.id);
    
    } catch (e) {
        console.log("ERROR: " + e)
    }

}



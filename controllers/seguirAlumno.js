const { models } = require('../models');

exports.seguimiento = async (res, button, next) => {
   try{
    let seguimiento;
    console.log("SEGUIR ALUMNO")
    //console.log("user"+user)
    escena= "escenaOne";
    /*recorrido = await models.Recorrido.findOne({where: {
        user: user,
        escena: escena, 
    }});
    if(recorrido==null){
        seguimiento ={
            user: user.nombre,
            answers: answers,
            tiempo,
        }
    }else{
        recorrido.answers.push(answer)
        console.log("SEGUIR answers"+anwers);
        console.log("SEGUIR user"+user)
        seguimiento ={
            user: recorrido.user.nombre,
            answers: recorrido.answers,
            tiempo,
        } 
    }*/
    console.log("button: " + button)
    //console.log("button: " + JSON.stringify(button))
    let answers=button[0] ;
    console.log("answers "+answers)
    seguimiento ={
        escena: escena,
        user: "Carolina",
        answers: answers,
        tiempo:"tiempo",
    }
    await models.Recorrido.create(seguimiento);
    res.render('/game');
   }catch(e){
       console.log("ERROR: "+ e)
   }

}
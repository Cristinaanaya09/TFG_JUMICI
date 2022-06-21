const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const { models } = require('../models');
const helpers = require('./helpers')

passport.use('local.signin', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const user = await models.User.findOne({ where: { username } })
        console.log( "LOGUEARSE: " + user);
        if(user !==null) {
            const result = await helpers.matchPassword(password, user.password);
            console.log("CONTRASEÑAS IGUALES: " + result);
            if(result){
                done(null, user)
            } else {
                done(null, false, req.flash('messages', "Incorrect username or password"));
            }
        }else{
            done(null, false, req.flash('messages', "Incorrect username or password"))
        }
    } catch (e) {
        console.log("ERROR EN PASSPORT SINGIN: " + e)
    }

}))




passport.use('local.signup', new Strategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {

    try {
        const { name, email, passwordRep } = req.body;
        let role='ALUMNO'
        if(email.includes('@upm.es'))
            role='PROFE'
        if (passwordRep === password) {
            newUser = {
                username,
                password,
                name,
                email,
                role
            }
        } else {
            return done(null, false, req.flash('messages', "Passwords does not match"));
        }
        newUser.password = await helpers.encryptPassword(password)
        await models.User.create(newUser);
        user = await models.User.findOne({ where: { username } })
        console.log("USER se ha guardado bien ok con id " + user.id)
        return done(null, user);
    } catch (error) {
        console.log("ERROR EN PASSPORT SING UP" + error);
    }
}
));

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser(async (id, done) => {
    const user = await models.User.findOne({ where: { id } });
    done(null, user);

})

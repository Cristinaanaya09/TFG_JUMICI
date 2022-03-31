//Para que no puedas acceder al juego sin loguearte
module.exports = {
    isLoggedIn(req, res, next){
        if (req.isAuthenticated()){  //devuelve trur o false si el user se ha logueado
            return next();
        }
        return res.redirect('/')
    },

    isNotLoggedIn(req, res, next){
        if (!req.isAuthenticated()){  //devuelve trur o false si el user se ha logueado
            return next();
        }
        return res.redirect('/game')
    }
}
//Para cifrar contraseña
const bcrypt = require('bcryptjs')
const helpers = {};

helpers.encryptPassword = async (password) => {
 const salt = await bcrypt.genSalt(10);
 const fpassword = bcrypt.hash(password, salt); 
 return fpassword;

}

helpers.matchPassword = async (password, passwordBDD) => {
   try{
    return await bcrypt.compare(password, passwordBDD);
   } catch (e){
       console.log("HELPERS" + e);
   }
}

module.exports = helpers;
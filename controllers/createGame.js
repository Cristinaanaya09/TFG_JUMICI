const fs = require("fs");

exports.download = async (req, res, next) => {
    try {
        console.log("DOWNLOAD")
        console.log(req.body.name)
        console.log("file")
        console.log(req.body.file)


        

        
        let promise=  new Promise(resolve => setTimeout(function () {
            fs.writeFile('./public/game/JUMICI/scenes/'+req.body.name + '.json', req.body.file, err => {
                if (err) {
                  console.error(err)
                  return
                }}
            )
            resolve();
        }, 1000));
      
        res.redirect('/createShow');
    } catch (e) {
        console.log("ERROR: " + e)
    }
}
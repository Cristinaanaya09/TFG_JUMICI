const languages = require('./languages/english');
const action = require('./actions');
const { models } = require('../models');
const Scene = require('./scene_class');


console.log("JUEGO PRINCAL")
function download(content, fileName, contentType) {
    //var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

exports.index = async (req, res, next) => {
    console.log('DENTRO DEL JUEGO');
    try {
        /*console.log('Waiting for hooooo to load');
        //Load language JSON file
        $.getJSON('languages/english.json', function (data) { language = data; });*/

        let language = JSON.stringify(languages)
        while (language == undefined) {
            console.log('Waiting for language to load');
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        //Check for scene name in search parameters
        var urlSearchParams = new URLSearchParams('./game');
        console.log("URL main SCENE PARAMETERS " + urlSearchParams.has('scene'));
        if (urlSearchParams.has('scene')) {
            var sceneName = urlSearchParams.get('scene');
            var scene = undefined;
            var sceneData = undefined;

            //Load scene JSON file
            //$.getJSON('scenes/' + sceneName + '.json', function (data) { sceneData = data; });
            sceneData = JSON.stringify('scenes/' + sceneName + '.json')
            while (sceneData == undefined) {
                console.log('Waiting for scene to load');
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            //Setup and run the desired scene
            scenes = new Scene(sceneData);
            scenes.setActions(actions);
            //scene.run();//this call does not block execution
            console.log('Everything loaded correctly');
        }
        else {
            console.log('No scene loaded.No scene name parameter on URL')
        }

        var actions = new Map();;
        function initializeActions () {
            actions.set(action.toggleOut.name, action.toggleOut);
            actions.set(action.toggleCenter.name, action.toggleCenter);
            actions.set(action.showMessage.name, action.showMessage);
            actions.set(action.loadCharacter.name, action.loadCharacter);
            actions.set(action.changeBackground.name, action.changeBackground);
            actions.set(action.activateDialogView.name, action.activateDialogView);
            actions.set(action.deactivateDialogView.name, action.deactivateDialogView);
            actions.set(action.activateTestView.name, action.activateTestView);
            actions.set(action.deactivateTestView.name, action.deactivateTestView);
            actions.set(action.getTestAnswer.name, action.getTestAnswer);
        }

        initializeActions();


        //Scene creation example
        let sceneOne = new Scene('sceneOne'); //Nombre de la escena
        // Add every step of the scene
        sceneOne.setNextStep(action.activateDialogView.name, 'office2.jpg');
        sceneOne.setNextStep(action.loadCharacter.name, ['left', 'char1.png']);
        sceneOne.setNextStep('loadCharacter', ['right', 'char2.png']);
        sceneOne.setNextStep(action.toggleCenter.name, "left");
        sceneOne.setNextStep(action.showMessage.name, [0, 0]);
        sceneOne.setNextStep(action.toggleCenter.name, "left");
        sceneOne.setNextStep(action.toggleOut.name, "right");
        sceneOne.setNextStep(action.showMessage.name, [0, 1]);
        sceneOne.setNextStep(action.toggleOut.name, "both");
        sceneOne.setNextStep(action.deactivateDialogView.name, "");
        sceneOne.setNextStep(action.activateTestView.name, [0, 0]);
        sceneOne.setNextStep(action.getTestAnswer.name, "");
        sceneOne.setNextStep(action.deactivateTestView.name, [0, 0]);
        sceneOne.setNextStep(action.activateDialogView.name, 'office1.jpg');
        sceneOne.setNextStep(action.toggleOut.name, "both");
        sceneOne.setNextStep(action.showMessage.name, [0, 2]);
        sceneOne.setNextStep(action.showMessage.name, [0, 3]);
        sceneOne.setNextStep(action.toggleOut.name, "left");
        sceneOne.setNextStep(action.changeBackground.name, "office2.jpg");
        sceneOne.setNextStep(action.loadCharacter.name, ['left', 'char3.png']);
        sceneOne.setNextStep(action.toggleOut.name, "left");
        sceneOne.setNextStep(action.showMessage.name, [0, 4]);
        sceneOne.setNextStep(action.showMessage.name, [0, 5]);
        sceneOne.setNextStep(action.showMessage.name, [0, 6]);
        sceneOne.setNextStep(action.toggleOut.name, "both");
        sceneOne.setNextStep(action.deactivateDialogView.name, "");
        sceneOne.setNextStep(action.activateTestView.name, [0, 1]);
        sceneOne.setNextStep(action.getTestAnswer.name, "");
        sceneOne.setNextStep(action.deactivateTestView.name, "");
        // //Run created scene
        sceneOne.setActions(actions);
        sceneOne.run();
        //Download scene JSON file, esto es opara si has creado una escena descargarla
        //download(JSON.stringify(sceneOne), sceneOne.name + '.json', 'text/plain');

        res.render("game");

    } catch (error) {
        next(error);
    }
};


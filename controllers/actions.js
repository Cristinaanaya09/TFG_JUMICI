/*ACTION*/

console.log("action")

/*
//Toggles the character with id "position" in and out of the scene, if position=='both' both characters are toggled
const toggleOut = (position) => {
    if(position=='both'){
        let character = document.getElementById('left');
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center'); 

        character = document.getElementById('right');
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center');
    }else{
        let character = document.getElementById(position);
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center');    
    }

    return new Promise(resolve => setTimeout(function () { resolve(); }, 1300));
};

////////////////ACTION/////////////////////////
//Toggles center position for the character  with id "position"
const toggleCenter = (position) => {
    let character = document.getElementById(position);
    character.classList.toggle('center');
    //If the character was out remove that class, since it is no longer out of the scene 
    if (character.classList.contains('out'))
        character.classList.remove('out');

    return new Promise(resolve => setTimeout(function () { resolve(); }, 1300));
};

/////////////////////ACTION/////////////////////
//Loads the image with name args[1] to the character in position args[0]
const loadCharacter = (args) => {
    let characterImagesPath = "./images/characters/";
    let position = args[0];
    let imageName = args[1];
    $('#' + position).html('<img src="' + characterImagesPath + imageName + '"></img>');
    return new Promise(resolve => resolve());
};

////////////////////////ACTION///////////////////////////
//Loads the background image with name "imageName" and shows the dialog div
const activateDialogView = (imageName) => {
    let backgroundImagesPath = "./images/backgrounds/";
    $('#background').html('<img src="' + backgroundImagesPath + imageName + '"></img>');
    $('#background').css('opacity', '1');
    document.getElementById('dialog').classList.remove('out');
    return new Promise(resolve => setTimeout(function () { resolve(); }, 1000));
};

//////////////////////////ACTION//////////////////////////
//Changes the background image with the one named "imageName"
const changeBackground = (imageName) => {
    let backgroundImagesPath = "./images/backgrounds/";    
    $('#background').css('opacity', '0');

    return new Promise(resolve => setTimeout(function () {
        $('#background').html('<img src="' + backgroundImagesPath + imageName + '"></img>');
        $('#background').css('opacity', '1');
        resolve();
     }, 1000));
};

//////////////////////////ACTION/////////////////////////////////
//Unloads background image and hides the dialog div
const deactivateDialogView = () => {
    $('#background').css('opacity', '0');
    document.getElementById('dialog').classList.add('out')
    return new Promise(resolve => setTimeout(function () {
         $('#background').html(''); 
         $('#speaker').html('');
         $('#message').html('');
         resolve(); 
        }, 1000));
};

/////////////////////////////ACTION////////////////////////////////////
//Loads test args[1] info from scene args[0] and shows the test div
const activateTestView = (args) => {
    let sceneNumber = args[0];
    let testNumber = args[1];
    let currentTest = language.sceneArray[sceneNumber].test[testNumber];    
    $('#question').html(currentTest.question);
    $('#text-A').html(currentTest.a);
    $('#text-B').html(currentTest.b);
    $('#text-C').html(currentTest.c);
    $('#text-D').html(currentTest.d);
    document.getElementById('test').classList.remove('out');
    return new Promise(resolve => setTimeout(function () { resolve(); }, 1000));
}

//////////////////////////////ACTION///////////////////////////////////////////
//Hides the test div and removes the test info from it
const deactivateTestView = () => {
    document.getElementById('test').classList.add('out');
    return new Promise(resolve => setTimeout(function () {
        $('#question').html(''); 
        $('#text-A').html('');
        $('#text-B').html('');
        $('#text-C').html('');
        $('#text-D').html(''); 
        resolve();
    }, 1000));
}

////////////////////////////////////////ACTION//////////////////////////////////
//Attaches the click function to each test option and waits until one option is clicked
const getTestAnswer = () => {
    let promise = new Promise((function (resolve, reject) { promiseResolve = resolve; promiseReject = reject; }));
    let initialTime = new Date();
    document.getElementById('button-A').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-B').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-C').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-D').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };

    return promise;
}
//Used in getTestAnswer()
//Handler for the buttons in a Test. Checks response time since initialTime, gets which option is clicked and resolves de test promise.
const answerClick = (id, initialTime, promiseResolve) => {
    let answerTime = new Date();
    document.getElementById('button-A').onclick = null;
    document.getElementById('button-B').onclick = null;
    document.getElementById('button-C').onclick = null;
    document.getElementById('button-D').onclick = null;
    id = id.replace("button-", '');
    promiseResolve();
    console.log('Answer: ' + id + ' Time: ' + (answerTime - initialTime) + 'ms');
}

///////////////////////////////////////ACTION////////////////////////////////////////////
//Displays the dialog in index args[1] of scene index args[0] 
const showMessage = async (args) => {
    let sceneNumber = args[0];
    let dialogNumber = args[1];
    let currentDialog = language.sceneArray[sceneNumber].dialog[dialogNumber];
    let fullText = currentDialog.message;
    let currentOffset = -1;
    let markUpArray = [];
    $('#message').html('<span id="visibleMessage"></span><span id="blankedMessage"></span>');
    $("#speaker").html(currentDialog.speaker + ' says:');
    document.getElementById('dialog').onclick = function () { $("#message").html(fullText);};
    do {
        await new Promise(resolve => setTimeout(resolve, 50));
        //this function can be implemented here to reduce the amount of functions in the script
        currentOffset = displayNextCharacter(currentOffset, fullText, markUpArray);
    } while (currentOffset < fullText.length)
    document.getElementById('dialog').onclick = null;
    return new Promise(resolve => $("#canvas").click(resolve));
}
//Used in showMessage()
//Displays next character in fullText accounting for markUp <...> </...> tags
const displayNextCharacter = (currentOffset, fullText, markUpArray) => {
    currentOffset++;
    if ($("#message").html() == fullText) {//If the message is complete return complete text length
        return fullText.length;
    }

    if (fullText[currentOffset] == "<" && fullText[currentOffset + 1] == "/") {
        markUpArray.pop();
        do {
            currentOffset++;
        } while (fullText[currentOffset] != ">");
        currentOffset++;
    }

    if (fullText[currentOffset] == "<" && fullText[currentOffset + 1] != "/") {
        let markup = "";
        do {
            markup += fullText[currentOffset];
            currentOffset++;
        } while (fullText[currentOffset] != ">");
        markup += fullText[currentOffset];
        currentOffset++;
        markUpArray.push(markup);
    }

    if (currentOffset == fullText.length) {
        $("#message").html(fullText);
        return;
    }

    var text = fullText.substring(0, currentOffset);
    $("#visibleMessage").html(text);
    if (markUpArray.length > 0) {
        $("#blankedMessage").html(markUpArray.toString().replace(",", "") + fullText.substring(currentOffset, fullText.length));
    } else {
        $("#blankedMessage").html(fullText.substring(currentOffset, fullText.length));
    }
    return currentOffset;
}

var actions = new Map();;
function initializeActions() {
    actions.set(toggleOut.name, toggleOut);
    actions.set(toggleCenter.name, toggleCenter);
    actions.set(showMessage.name, showMessage);
    actions.set(loadCharacter.name, loadCharacter);
    actions.set(changeBackground.name, changeBackground);
    actions.set(activateDialogView.name, activateDialogView);
    actions.set(deactivateDialogView.name, deactivateDialogView);
    actions.set(activateTestView.name, activateTestView);
    actions.set(deactivateTestView.name, deactivateTestView);
    actions.set(getTestAnswer.name, getTestAnswer);
}
initializeActions();
*/


//Toggles the character with id "position" in and out of the scene, if position=='both' both characters are toggled
exports.toggleOut = (position) => {
    if(position=='both'){
        console.log(" ToggleOut character ")
        let character = document.getElementById('left');
        console.log(" ToggleOut character " + character)
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center'); 

        character = document.getElementById('right');
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center');
    }else{
        let character = document.getElementById(position);
        console.log(" ToggleOut character " + character)
        character.classList.toggle('out');
        //If the character was centered remove that class, since it is no longer at the center
        if (character.classList.contains('center'))
            character.classList.remove('center');    
    }

    return new Promise(resolve => setTimeout(function () { resolve(); }, 1300));
};


///////////////////////////////////////ACTION////////////////////////////////////

//Toggles center position for the character  with id "position"
exports.toggleCenter = (position) => {
    let character = document.getElementById(position);
    character.classList.toggle('center');
    //If the character was out remove that class, since it is no longer out of the scene 
    if (character.classList.contains('out'))
        character.classList.remove('out');

    return new Promise(resolve => setTimeout(function () { resolve(); }, 1300));
};

/////////////////////ACTION/////////////////////
//Loads the image with name args[1] to the character in position args[0]
exports.loadCharacter = (args) => {
    let characterImagesPath = "./images/characters/";
    let position = args[0];
    let imageName = args[1];
    $('#' + position).html('<img src="' + characterImagesPath + imageName + '"></img>');
    console.log("loadcharacter!")
    return new Promise(resolve => resolve());
};


///////////////////////////////////////ACTION////////////////////////////////////

//Loads the background image with name "imageName" and shows the dialog div
exports.activateDialogView = (imageName) => {
    console.log(" activate dialog");
    let backgroundImagesPath = "./images/backgrounds/";
    $('#background').html('<img src="' + backgroundImagesPath + imageName + '"></img>');
    $('#background').css('opacity', '1');
    document.getElementById('dialog').classList.remove('out');
    console.log(" activate dialog FINAL");
    return new Promise(resolve => setTimeout(function () { resolve(); }, 1000));
};


///////////////////////////////////////ACTION////////////////////////////////////

//Changes the background image with the one named "imageName"
exports.changeBackground = (imageName) => {
    console.log(" change Background ")
    let backgroundImagesPath = "./images/backgrounds/";    
    $('#background').css('opacity', '0');

    console.log(" change Background FINAL")
    return new Promise(resolve => setTimeout(function () {
        $('#background').html('<img src="' + backgroundImagesPath + imageName + '"></img>');
        $('#background').css('opacity', '1');
        resolve();
     }, 1000));
};

///////////////////////////////////////ACTION////////////////////////////////////

//Unloads background image and hides the dialog div
exports.deactivateDialogView = () => {
    $('#background').css('opacity', '0');
    document.getElementById('dialog').classList.add('out')
    return new Promise(resolve => setTimeout(function () {
         $('#background').html(''); 
         $('#speaker').html('');
         $('#message').html('');
         resolve(); 
        }, 1000));
};

///////////////////////////////////////ACTION////////////////////////////////////

//Loads test args[1] info from scene args[0] and shows the test div
exports.activateTestView = (args) => {
    console.log("Activate Test View")
    let sceneNumber = args[0];
    let testNumber = args[1];
    let currentTest = language.sceneArray[sceneNumber].test[testNumber];    
    $('#question').html(currentTest.question);
    $('#text-A').html(currentTest.a);
    $('#text-B').html(currentTest.b);
    $('#text-C').html(currentTest.c);
    $('#text-D').html(currentTest.d);
    document.getElementById('test').classList.remove('out');
    console.log("Activate Test View FINAL")
    return new Promise(resolve => setTimeout(function () { resolve(); }, 1000));
}

////////////////////////////////////////ACTION/////////////////////////////////////

//Hides the test div and removes the test info from it
exports.deactivateTestView = () => {
    document.getElementById('test').classList.add('out');
    return new Promise(resolve => setTimeout(function () {
        $('#question').html(''); 
        $('#text-A').html('');
        $('#text-B').html('');
        $('#text-C').html('');
        $('#text-D').html(''); 
        resolve();
    }, 1000));
}

////////////////////////////////////////ACTION//////////////////////////////////
//Attaches the click function to each test option and waits until one option is clicked
exports.getTestAnswer = () => {
    let promise = new Promise((function (resolve, reject) { promiseResolve = resolve; promiseReject = reject; }));
    let initialTime = new Date();
    console.log("getTestAnswer")
    document.getElementById('button-A').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-B').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-C').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };
    document.getElementById('button-D').onclick = function () { answerClick(this.id, initialTime, promiseResolve); };

    return promise;
}
//Used in getTestAnswer()
//Handler for the buttons in a Test. Checks response time since initialTime, gets which option is clicked and resolves de test promise.
exports.answerClick = (id, initialTime, promiseResolve) => {
    let answerTime = new Date();
    document.getElementById('button-A').onclick = null;
    document.getElementById('button-B').onclick = null;
    document.getElementById('button-C').onclick = null;
    document.getElementById('button-D').onclick = null;
    id = id.replace("button-", '');
    promiseResolve();
    console.log('Answer: ' + id + ' Time: ' + (answerTime - initialTime) + 'ms');
}


///////////////////////////////////////ACTION////////////////////////////////////

//Displays the dialog in index args[1] of scene index args[0] 
exports.showMessage = async (args) => {
    let sceneNumber = args[0];
    let dialogNumber = args[1];
    let currentDialog = language.sceneArray[sceneNumber].dialog[dialogNumber];
    let fullText = currentDialog.message;
    let currentOffset = -1;
    let markUpArray = [];
    $('#message').html('<span id="visibleMessage"></span><span id="blankedMessage"></span>');
    $("#speaker").html(currentDialog.speaker + ' says:');
    document.getElementById('dialog').onclick = function () { $("#message").html(fullText);};
    do {
        await new Promise(resolve => setTimeout(resolve, 50));
        //this function can be implemented here to reduce the amount of functions in the script
        currentOffset = displayNextCharacter(currentOffset, fullText, markUpArray);
    } while (currentOffset < fullText.length)
    document.getElementById('dialog').onclick = null;
    return new Promise(resolve => $("#canvas").click(resolve));
}
//Used in showMessage()
//Displays next character in fullText accounting for markUp <...> </...> tags
exports.displayNextCharacter = (currentOffset, fullText, markUpArray) => {
    currentOffset++;
    if ($("#message").html() == fullText) {//If the message is complete return complete text length
        return fullText.length;
    }

    if (fullText[currentOffset] == "<" && fullText[currentOffset + 1] == "/") {
        markUpArray.pop();
        do {
            currentOffset++;
        } while (fullText[currentOffset] != ">");
        currentOffset++;
    }

    if (fullText[currentOffset] == "<" && fullText[currentOffset + 1] != "/") {
        let markup = "";
        do {
            markup += fullText[currentOffset];
            currentOffset++;
        } while (fullText[currentOffset] != ">");
        markup += fullText[currentOffset];
        currentOffset++;
        markUpArray.push(markup);
    }

    if (currentOffset == fullText.length) {
        $("#message").html(fullText);
        return;
    }

    var text = fullText.substring(0, currentOffset);
    $("#visibleMessage").html(text);
    if (markUpArray.length > 0) {
        $("#blankedMessage").html(markUpArray.toString().replace(",", "") + fullText.substring(currentOffset, fullText.length));
    } else {
        $("#blankedMessage").html(fullText.substring(currentOffset, fullText.length));
    }
    return currentOffset;
}


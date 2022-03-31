/*exports.Scene = (input) => {
        // Constructor from String 
        if (typeof (input) == 'string') {
            this.name = input;
            this.currentStep = 0;
            this.length = 0;
            this.actionKeys = new Array();
            this.actionArguments = new Array();
            this.actions = undefined;
        }
        // Constructor from JSON scene object 
        if (typeof (input) == 'object') {
            this.name = input.name;
            this.currentStep = 0;
            this.length = input.length;
            this.actionKeys = input.actionKeys;
            this.actionArguments = input.actionArguments;
            this.actions = undefined;
        }
    

}
    // Used to assign the map with the action functions to the scene variable
exports.setActions = (actions) => {
        this.actions = actions;
    }
exports.runNextStep = () => {
        let promise = this.actions.get(this.actionKeys[this.currentStep])(this.actionArguments[this.currentStep]);
        this.currentStep++;
        return promise;
    }
    //Runs all the actions in the scene from the beginning.
exports.run = async () => {
        this.currentStep = 0;
        while (this.currentStep < this.length) {
            await this.runNextStep();
        }
    }
    //For scene creation, adds the corresponding action and arguments to the end of each array
exports.setNextStep = (actionKey, args) => {
        this.actionKeys.push(actionKey);
        this.actionArguments.push(args)
        this.length++;
}*/

module.exports = class Scene {
    constructor(input) {
        /* Constructor from String */
        if (typeof (input) == 'string') {
            this.name = input;
            this.currentStep = 0;
            this.length = 0;
            this.actionKeys = new Array();
            this.actionArguments = new Array();
            this.actions = undefined;
        }
        /* Constructor from JSON scene object */
        if (typeof (input) == 'object') {
            this.name = input.name;
            this.currentStep = 0;
            this.length = input.length;
            this.actionKeys = input.actionKeys;
            this.actionArguments = input.actionArguments;
            this.actions = undefined;
        }
    }
    // Used to assign the map with the action functions to the scene variable
    setActions(actions) {
        this.actions = actions;
    }
    runNextStep() {
        let promise = this.actions.get(this.actionKeys[this.currentStep])(this.actionArguments[this.currentStep]);
        this.currentStep++;
        return promise;
    }
    //Runs all the actions in the scene from the beginning.
    async run() {
        this.currentStep = 0;
        while (this.currentStep < this.length) {
            await this.runNextStep();
        }
    }
    //For scene creation, adds the corresponding action and arguments to the end of each array
    setNextStep(actionKey, args) {
        this.actionKeys.push(actionKey);
        this.actionArguments.push(args)
        this.length++;
    }
}
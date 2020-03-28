"use strict";
class Interaction {
    constructor() {
        this.moveMode = false;
        this.gui = new Ui();
    }
    update() {
        this.moveMode = input.held[16]; // shift
    }
}

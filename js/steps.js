class Steps {
  constructor(file, steps) {
    this.file = file;
    this.steps = steps;
    this.init();
  }

  init() {
    this.sprite = new cc.Sprite(this.file);
    this.addStepsText();
  }

  addStepsText() {
    let stepTTF = new cc.LabelTTF("Step:", "Coiny", "24", cc.TEXT_ALIGNMENT_CENTER);
    this.sprite.addChild(stepTTF, 2);
    stepTTF.setPosition(130, 245);

    this.stepsText = new cc.LabelTTF(this.steps, "Coiny", "56", cc.TEXT_ALIGNMENT_CENTER);
    this.sprite.addChild(this.stepsText, 2);
    this.stepsText.setPosition(127, 145);
  }

  updateSteps() {
    if (!this.isLose()) {
      this.steps--;
      this.stepsText.setString(this.steps);
      let actionUp = new cc.ScaleTo(0.1, 1.4, 1.4);
      let actionDown = new cc.ScaleTo(0.1, 1, 1);
      let seq = new cc.Sequence([actionUp, actionDown]);
      this.stepsText.runAction(seq);
    }
  }

  isLose() {
    let lose = this.steps === 0 ? true : false;
    return lose
  }
}
let Steps = (function () {
  // 'steps' text
  const zIndexStepCount = 2;
  const fontSizeStepText = 24;
  const xPositionForText = 130;
  const yPositionForText = 245;
  //count
  const zIndexStepText = 2;
  const fontSizeStepCount = 56;
  const xPositionForCount = 127;
  const yPositionForCount = 145;
  //animation
  const timeForCountAnimation = 0.1;//время для анимации на увеличение и уменьшение счёта ходов
  const scaleValue = 1.4;
  const standartSizeForText = 1;
  // goal
  const zIndexGoalText = 2;
  const fontSizeGoalText = 24;
  const xPositionForGoalText = 125;
  const yPositionForGoalText = 50;



  class Steps {
    constructor(file, steps, goal) {
      this.file = file;
      this.steps = steps;
      this.goal = goal;
      this.init();
    }

    init() {
      this.sprite = new cc.Sprite(this.file);
      this.addStepsText();
    }

    addStepsText() {
      let stepTTF = new cc.LabelTTF("Steps:", "Coiny", fontSizeStepText, cc.TEXT_ALIGNMENT_CENTER);
      this.sprite.addChild(stepTTF, zIndexStepText);
      stepTTF.setPosition(xPositionForText, yPositionForText);

      this.stepsText = new cc.LabelTTF(this.steps, "Coiny", fontSizeStepCount, cc.TEXT_ALIGNMENT_CENTER);
      this.sprite.addChild(this.stepsText, zIndexStepCount);
      this.stepsText.setPosition(xPositionForCount, yPositionForCount);

      let goalText = new cc.LabelTTF("Goal: " + this.goal, "Coiny", fontSizeGoalText, cc.TEXT_ALIGNMENT_CENTER);
      this.sprite.addChild(goalText, zIndexGoalText);
      goalText.setPosition(xPositionForGoalText, yPositionForGoalText);
    }

    updateSteps() {
      if (!this.isStepsEnd()) {
        this.steps--;
        this.stepsText.setString(this.steps);
        let actionUp = new cc.ScaleTo(timeForCountAnimation, scaleValue, scaleValue);
        let actionDown = new cc.ScaleTo(timeForCountAnimation, standartSizeForText, standartSizeForText);
        let seq = new cc.Sequence([actionUp, actionDown]);
        this.stepsText.runAction(seq);
      }
    }

    isStepsEnd() {
      return this.steps === 0 ? true : false;
    }
  }
  return Steps
}())
class ProgressBar {
  constructor(file, startX, startY, progressBarLenght, goal) {
    this.startX = startX;
    this.startY = startY;
    this.goal = goal;
    this.barLength = progressBarLenght / 100;
    this.file = file;
    this.score = 0;
    this.currentBarPosition = 0;
    this.init();
  }

  init() {
    this.sprite = new cc.Sprite(this.file);
    this.addScore();
  }

  addScore() {
    this.scoreText = new cc.LabelTTF("0/" + `${this.goal}`, "Coiny", "24", cc.TEXT_ALIGNMENT_CENTER);
    this.sprite.addChild(this.scoreText, 2);
    this.scoreText.setPosition(113, 55);
  }

  updateScore(arr) {
    let dif = arr.length * 10;
    let progress = Math.floor(this.score / this.goal * 100);

    let update = () => {
      this.score++;
      dif--;
      let progressNow = Math.floor(this.score / this.goal * 100);
      if (!this.isWon()) {
        if (progressNow > progress) {
          this.addBar(progressNow)
          progress = progressNow
        }
        this.scoreText.setString(this.score + "/" + `${this.goal}`);
        if (dif === 0) {
          this.sprite.unschedule(update)
        }
      }
    }
    this.sprite.schedule(update, 0.01);
  }

  isWon() {
    let won = this.score > this.goal ? true : false;
    return won
  }

  addBar(progress) {
    let bars = progress - this.currentBarPosition;
    let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
    oneBar.setPosition(this.startX + this.currentBarPosition * this.barLength, this.startY);
    this.sprite.addChild(oneBar, 1)
    let moveAction = new cc.MoveTo(0.3, this.startX + (this.currentBarPosition + bars) * this.barLength, this.startY);
    for (let i = 0; i < bars; i++) {
      let currentPosition = this.startX + this.currentBarPosition * this.barLength;
      let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
      oneBar.setPosition(currentPosition + i * this.barLength, this.startY);
      this.sprite.addChild(oneBar, 1);
    }
    oneBar.runAction(moveAction);
    this.currentBarPosition += bars;
  }

}
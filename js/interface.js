class ProgressBar {
  constructor(file) {
    this.file = file;
    this.init();
  }

  init() {
    this.sprite = new cc.Sprite(this.file);
    this.addScore();
  }

  addScore() {
    this.scoreText = new cc.LabelTTF("0/" + `${goal}`, "Coiny", "24", cc.TEXT_ALIGNMENT_CENTER);
    this.sprite.addChild(this.scoreText, 2);
    this.scoreText.setAnchorPoint(0, 0)
    this.scoreText.setPosition(80, 35);
  }

  updateScore(arr) {
    let dif = arr.length * 10;
    let progress = Math.floor(this.score / goal * 100);

    //this.addBar(progress)

    let update = () => {
      this.score++;
      dif--;
      let progressNow = Math.floor(this.score / goal * 100);
      let won = this.score > goal ? true : false;
      if (!won) {
        if (progressNow > progress) {
          this.addBar(progressNow)
          progress = progressNow
        }
        this.scoreText.setString(this.score + "/" + `${goal}`);
        if (dif === 0) {
          this.unschedule(update)
        }
      }
    }
    this.schedule(update, 0.01);
  }

  // addBar(progress) {
  //   let bars = progress - this.barPosition;
  //   let startX = 575;
  //   let startY = 520;
  //   let barLength = 169 / 100;
  //   let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
  //   oneBar.setPosition(startX + this.barPosition * barLength, startY);
  //   this.addChild(oneBar, 3)
  //   let moveAction = new cc.MoveTo(0.3, startX + (this.barPosition + bars) * barLength, startY);
  //   // let seq = new cc.Sequence(moveAction, cc.callFunc(function () {
  //   for (let i = 0; i < bars; i++) {
  //     let currentPosition = startX + this.barPosition * barLength;
  //     let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
  //     oneBar.setPosition(currentPosition + i * barLength, startY);
  //     this.addChild(oneBar, 3);
  //   }
  //   oneBar.runAction(moveAction);
  //   this.barPosition += bars;
  // }

}
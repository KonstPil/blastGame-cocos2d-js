let ProgressBar = (function () {
  const moveBarAnimationTime = 0.3; //время движения прогресс бара при набирании очков
  const zIndexBar = 1;
  const zIndexScore = 2;
  const fontSizeForScore = 24;
  const updateScoreTime = 0.007; //время с которым обновляется счётчик
  const XCoordForPositionScoreText = 113;//x места расположения текста с кол-вом очков
  const YCoordForPositionScoreText = 55;//y места расположения текста с кол-вом очков


  class ProgressBar {
    constructor(file, startX, startY, progressBarLenght, goal, oneTileCost) {
      this.startX = startX;
      this.startY = startY;
      this.goal = goal;
      this.barLength = progressBarLenght / 100;
      this.file = file;
      this.score = 0;
      this.oneTileCost = oneTileCost;
      this.currentBarPosition = 0;
      this.init();
    }

    init() {
      this.sprite = new cc.Sprite(this.file);
      this.addScore();
    }

    addScore() {
      this.scoreText = new cc.LabelTTF("0/" + `${this.goal}`, 'Coiny', fontSizeForScore, cc.TEXT_ALIGNMENT_CENTER);
      this.sprite.addChild(this.scoreText, zIndexScore);
      this.scoreText.setPosition(XCoordForPositionScoreText, YCoordForPositionScoreText);
    }

    updateScore(arr) {
      let dif = arr.length * this.oneTileCost;
      let scoreForAnimation = this.score;
      this.score = this.score + dif;
      let progressBefore = Math.floor(scoreForAnimation / this.goal * 100);
      let update = () => {
        scoreForAnimation++;
        let progressNow = Math.floor(scoreForAnimation / this.goal * 100);
        let finishAnimationOrNot = scoreForAnimation > this.goal ? true : false;
        if (!finishAnimationOrNot) {
          if (progressNow > progressBefore) {
            this.addBar(progressNow)
            progressBefore = progressNow
          }
          this.scoreText.setString(scoreForAnimation + "/" + `${this.goal}`);
          if (scoreForAnimation >= this.score) {
            this.sprite.unschedule(update)
          }
        } else {
          this.sprite.unschedule(update)
        }
      }
      this.sprite.schedule(update, updateScoreTime);
    }

    isScoreAchieved() {
      return this.score >= this.goal ? true : false;
    }


    addBar(progress) {
      let bars = progress - this.currentBarPosition;
      let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
      oneBar.setPosition(this.startX + this.currentBarPosition * this.barLength, this.startY);
      this.sprite.addChild(oneBar, zIndexBar)
      let moveAction = new cc.MoveTo(moveBarAnimationTime, this.startX + (this.currentBarPosition + bars) * this.barLength, this.startY);
      for (let i = 0; i < bars; i++) {
        let currentPosition = this.startX + this.currentBarPosition * this.barLength;
        let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
        oneBar.setPosition(currentPosition + i * this.barLength, this.startY);
        this.sprite.addChild(oneBar, zIndexBar);
      }
      oneBar.runAction(moveAction);
      this.currentBarPosition += bars;
    }

  }
  return ProgressBar
}())
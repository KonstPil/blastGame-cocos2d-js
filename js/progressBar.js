const moveBarAnimationTime = 0.3; //время движения прогресс бара при набирании очков
const zIndexBar = 1;
const zIndexScore = 2;
const fontSizeForScore = 24;
const updateScoreTime = 0.01; //время с которым обновляется счётчик
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
    this.scoreText = new cc.LabelTTF("0/" + `${this.goal}`, "Coiny", fontSizeForScore, cc.TEXT_ALIGNMENT_CENTER);
    this.sprite.addChild(this.scoreText, zIndexScore);
    this.scoreText.setPosition(XCoordForPositionScoreText, YCoordForPositionScoreText);
  }

  updateScore(arr) {
    let dif = arr.length * this.oneTileCost;
    let progress = Math.floor(this.score / this.goal * 100);

    let update = () => {
      this.score++;
      dif--;
      let progressNow = Math.floor(this.score / this.goal * 100);
      this.isWon()
      if (!this.iswin) {
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
    this.sprite.schedule(update, updateScoreTime);
  }

  isWon() {
    this.iswin = this.score > this.goal ? true : false;
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
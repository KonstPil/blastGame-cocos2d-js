class GameManager {
  constructor() {
    this.init();
  }

  init() {
    let fieldSprite = new FieldSprite(res.FIELD_IMAGE, Field, 9, 9, 15, 13);
    fieldSprite.setPosition(18, 18);
    fieldSprite.setAnchorPoint(0, 0);
    this.addChild(fieldSprite, 1);//z-index для слоя 
    //
    let progressBar = new ProgressBar(res.PROGRESS_IMAGE);
    progressBar.sprite.setPosition(645, 545);
    fieldSprite.addChild(progressBar.sprite, 1);
    //
  }
}
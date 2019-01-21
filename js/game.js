

let GameLayer = cc.Layer.extend({
  ctor(fieldStartX, fieldStartY) {
    this._super();
    this.fieldStartX = fieldStartX;
    this.fieldStartY = fieldStartY;
    this.init();
  },

  init() {
    //размер окна
    let size = cc.director.getWinSize();
    //устанавливаем bg
    let background = cc.LayerColor.create(new cc.Color(160, 160, 160, 255),
      size.width, size.height);
    this.addChild(background, 0);//z-index для слоя 
    //устанавливаем field and tiles
    this.field = new FieldSprite(res.FIELD_IMAGE, Field, 9, 9, 15, 13);
    this.field.setPosition(this.fieldStartX, this.fieldStartY);
    this.field.setAnchorPoint(0, 0);
    this.addChild(this.field, 1);//z-index для слоя 
    //
    this.progressBar = new ProgressBar(res.PROGRESS_IMAGE, 24, 29.5, 169, 5000);
    this.progressBar.sprite.setPosition(660, 565);
    this.addChild(this.progressBar.sprite, 1);
    //
    this.steps = new Steps(res.STEPS_IMAGE, 20);
    this.steps.sprite.setPosition(662, 350);
    this.addChild(this.steps.sprite, 1);
    //
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
    }, this)
  },

  onTouchBegan(touch, event) {
    let target = event.getCurrentTarget();
    let location = touch.getLocation();//находим координаты относительно field
    let pickedLocation = target.normalizeLocation(location);
    let pickedTileRowAndColOnField = target.field.normalizePick(pickedLocation);


    let commonTiles = target.field.fieldlogic.findTiles(pickedTileRowAndColOnField);


    if (commonTiles && commonTiles.length > 0) {
      target.field.deleteTiles(commonTiles);
      target.progressBar.updateScore(commonTiles)
      target.field.moveRemainingTiles();
      target.field.addNewTiles();
      target.steps.updateSteps()
      target.isWinOrLose();
    }
  },


  //находим row and col с учётом начала field
  normalizeLocation(location) {
    let pickedY = location.y - this.fieldStartY;
    let pickedX = location.x - this.fieldStartX;
    let pick = { x: pickedX, y: pickedY };
    return pick;
  },

  isWinOrLose() {
    if (this.progressBar.isWon() && !this.steps.isLose()) {
      console.log('you won');
    } else if (this.steps.isLose() && !this.progressBar.isWon()) {
      console.log('you lose');
    }
  }

})

function scene() {
  let scene = new cc.Scene();
  let layer = new GameLayer(18, 18);
  scene.addChild(layer);
  return scene;
}


window.onload = function () {

  cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.
      SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
      cc.director.runScene(scene());
    }, this);
  };
  cc.game.run("gameCanvas");
};
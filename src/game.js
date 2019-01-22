const zIndexField = 1;
const zIndexBG = 0;
const zIndexProgress = 1;
const zIndexSteps = 1;
const zIndexWinLose = 2;
const fontSizeWinLose = 80;
const xPositionWinLose = 270;
const yPositionWinLose = 320;

let GameLayer = cc.Layer.extend({
  ctor(fieldStartX, fieldStartY) {
    this._super();
    this.fieldStartX = fieldStartX;
    this.fieldStartY = fieldStartY;
    this.canIPick = true;
    this.init();
  },

  init() {
    //размер окна
    let size = cc.director.getWinSize();
    //устанавливаем bg
    let background = cc.LayerColor.create(new cc.Color(160, 160, 160, 255),
      size.width, size.height);
    this.addChild(background, zIndexBG);//z-index для слоя 
    //устанавливаем field and tiles
    this.field = new FieldSprite(res.FIELD_IMAGE, Field, 9, 9, 41.5, 43);
    this.field.setPosition(this.fieldStartX, this.fieldStartY);
    this.field.setAnchorPoint(0, 0);
    this.addChild(this.field, zIndexField);//z-index для слоя 
    //
    this.progressBar = new ProgressBar(res.PROGRESS_IMAGE, 24, 29.5, 169, 1000, 5);
    this.progressBar.sprite.setPosition(660, 565);
    this.addChild(this.progressBar.sprite, zIndexProgress);
    //
    let goal = this.progressBar.goal;
    this.steps = new Steps(res.STEPS_IMAGE, 35, goal);
    this.steps.sprite.setPosition(662, 300);
    this.addChild(this.steps.sprite, zIndexSteps);
    //
    this.listener = cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
    }, this)
  },

  onTouchBegan(touch, event) {
    let target = event.getCurrentTarget();
    if (target.canIPick) {
      let location = touch.getLocation();//находим координаты относительно field
      let pickedLocation = target.normalizeLocation(location);
      let pickedTileRowAndColOnField = target.field.normalizePick(pickedLocation);
      let arrInfo = target.field.fieldlogic.findTiles(pickedTileRowAndColOnField);
      let commonTiles = arrInfo.arr;
      let isSuperTileWasPicked = arrInfo.isSuperTileWasPicked;
      let pointsForOneTile = target.progressBar.oneTileCost;
      if (commonTiles && commonTiles.length > 0) {
        target.canIPick = false;
        if (isSuperTileWasPicked) {
          let pick = arrInfo.superTiles;
          target.field.animationForSuperTiles(pick, function () {
            target.mainGameLogic(commonTiles, pickedLocation, pointsForOneTile);
            target.canIPick = true;
          });
        } else {
          target.field.animationForNormalTiles(commonTiles, function () {
            target.mainGameLogic(commonTiles, pickedLocation, pointsForOneTile);
            target.canIPick = true;
          });
        }

      }
    }

  },

  mainGameLogic(arr, loc, points) {
    this.field.deleteTiles(arr);
    this.field.addPoints(arr, loc, points);
    this.progressBar.updateScore(arr);
    this.field.moveRemainingTiles();
    this.field.addNewTiles();
    this.steps.updateSteps();
    this.isWinOrLose();

  },


  //находим row and col с учётом начала field
  normalizeLocation(location) {
    let pickedY = location.y - this.fieldStartY;
    let pickedX = location.x - this.fieldStartX;
    let pick = { x: pickedX, y: pickedY };
    return pick;
  },

  isWinOrLose() {
    let isScoreAchieved = this.progressBar.isScoreAchieved();
    let isStepsEnd = this.steps.isStepsEnd();
    if (isScoreAchieved && !isStepsEnd || isScoreAchieved && isStepsEnd) {
      this.winOrLoseTextapperance('You won!')
      cc.eventManager.removeListener(this.listener)
    } else if (isStepsEnd && !isScoreAchieved) {
      this.winOrLoseTextapperance('You lost!')

      cc.eventManager.removeListener(this.listener)
    }
  },

  winOrLoseTextapperance(string) {
    let text = new cc.LabelTTF(string, "Coiny", fontSizeWinLose, cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(text, zIndexWinLose);
    text.setPosition(xPositionWinLose, this.height + 100);
    let moveAction = new cc.MoveTo(2.7, xPositionWinLose, yPositionWinLose);
    text.runAction(moveAction);
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
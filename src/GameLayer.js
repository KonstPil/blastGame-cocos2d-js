let GameLayer = (function () {
  //field
  const anchorPointForField = 0;
  //
  const zIndexField = 1;
  const zIndexBG = 0;
  const zIndexProgress = 1;
  const zIndexSteps = 1;
  //win lose text animation
  const zIndexWinLose = 2;
  const fontSizeWinLose = 80;
  const xPositionWinLose = 270;
  const yPositionWinLose = 320;
  const timeForWinLoseAnimation = 2.7;
  //progress bar position
  const xProgressPosition = 660;
  const yProgressPosition = 565;
  //steps bar position
  const xStepsBarPosition = 662;
  const yStepsBarPosition = 300;

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
      this.field = new FieldSprite(res.FIELD_IMAGE, fieldLogic, 9, 9, 41.5, 43);
      this.field.setPosition(this.fieldStartX, this.fieldStartY);
      this.field.setAnchorPoint(anchorPointForField, anchorPointForField);
      this.addChild(this.field, zIndexField);//z-index для слоя 
      //устанавливаем ProgressBar
      this.progressBar = new ProgressBar(res.PROGRESS_IMAGE, 24, 29.5, 169, 1000, 5);
      this.progressBar.sprite.setPosition(xProgressPosition, yProgressPosition);
      this.addChild(this.progressBar.sprite, zIndexProgress);
      //устанавливаем панель со счётом очков
      let goal = this.progressBar.goal;
      this.steps = new Steps(res.STEPS_IMAGE, 35, goal);
      this.steps.sprite.setPosition(xStepsBarPosition, yStepsBarPosition);
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
        let location = touch.getLocation();
        let pickedLocation = target.normalizeLocation(location);//находим координаты относительно field
        let pickedTileRowAndColOnField = target.field.normalizePick(pickedLocation);//находим координаты col and row on the field
        let arrInfo = target.field.fieldlogic.findTiles(pickedTileRowAndColOnField);
        let commonTiles = arrInfo.arr;//массив для удаления с поля
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

    //основная логика игры 
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


    //проверка на gameOver and won
    isWinOrLose() {
      let isScoreAchieved = this.progressBar.isScoreAchieved();
      let isStepsEnd = this.steps.isStepsEnd();
      if (isScoreAchieved && !isStepsEnd || isScoreAchieved && isStepsEnd) {
        this.winOrLoseTextapperance('You won!')
        cc.eventManager.removeListener(this.listener)
      } else if (isStepsEnd && !isScoreAchieved) {
        this.winOrLoseTextapperance('Game over!')

        cc.eventManager.removeListener(this.listener)
      }
    },

    //появления текста после выйгрыша или пройгрыша
    winOrLoseTextapperance(string) {
      let text = new cc.LabelTTF(string, "Coiny", fontSizeWinLose, cc.TEXT_ALIGNMENT_CENTER);
      this.addChild(text, zIndexWinLose);
      text.setPosition(xPositionWinLose, this.height + 100);
      let moveAction = new cc.MoveTo(timeForWinLoseAnimation, xPositionWinLose, yPositionWinLose);
      text.runAction(moveAction);
    }

  })
  return GameLayer;
}())
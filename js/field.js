const tileWidthOnField = 53;
const tileHeightOnField = 60;
const xTailStartOnField = 15;
const yTailStartOnField = 13;
const zIndexTiles = 2;
const goal = 1000;


let FieldSprite = cc.Sprite.extend({
  ctor(spriteFrameName, logic, rows, colls) {
    this._super(spriteFrameName);
    this.rows = rows;
    this.colls = colls;
    this.tileWidthOnField = 53;
    this.tileHeightOnField = 60;
    this.xTailStartOnField = 15;
    this.yTailStartOnField = 13;
    this.fieldlogic = new logic(rows, colls);
    this.score = 0;
    this.barPosition = 0;
    this.init();
  },

  init() {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
    }, this)
    this.addFieldTiles();
    this.addScore();
  },

  addScore() {
    this.scoreText = new cc.LabelTTF("0/" + `${goal}`, "Coiny", "24", cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(this.scoreText, 2);
    this.scoreText.setPosition(665, 542);
  },

  onTouchBegan(touch, event) {
    let target = event.getCurrentTarget();
    let location = target.convertToNodeSpace(touch.getLocation());//находим координаты относительно field
    let pickedTileRowAndCol = target.normalizePick(location);
    let commonTiles = target.fieldlogic.findTiles(pickedTileRowAndCol);
    console.log(commonTiles);
    if (commonTiles && commonTiles.length > 0) {
      target.deleteTiles(commonTiles);
      //target.updateScore(pickedArr)
      target.fieldlogic.moveRemainingTiles();
      target.addNewTiles();
    }
  },

  //находим row and col с учётом начала tiles
  normalizePick(location) {
    let pickedRow = Math.floor((location.y - this.yTailStartOnField) / this.tileHeightOnField);
    let pickedCol = Math.floor((location.x - this.xTailStartOnField) / this.tileWidthOnField);
    let tail = { row: pickedRow, col: pickedCol };
    return tail;
  },

  //находим клетки с пропусками и вызываемcreateNewTile
  addNewTiles() {
    for (let i = 0; i < this.fieldlogic.rows; i++) {
      for (let k = 0; k < this.fieldlogic.colls; k++) {
        if (this.fieldlogic.tiles[i][k] === null) {
          let holesUpon = this.fieldlogic.rows - i;
          this.createNewTile(i, k, holesUpon)
        }
      }
    }
  },

  //создаём новые клетки и перемещаем их на место где ничего нет
  createNewTile(row, col, holesUpon) {
    let tile = this.fieldlogic.createOneTile(row, col);
    tile.sprite.setPosition(xTailStartOnField + col * tileWidthOnField, yTailStartOnField + (row + holesUpon) * tileHeightOnField);
    this.addChild(tile.sprite, zIndexTiles);


    let coordX = xTailStartOnField + col * tileWidthOnField;
    let coordY = yTailStartOnField + row * tileHeightOnField;
    let moveAction = new cc.MoveTo(0.4, coordX, coordY);
    tile.sprite.runAction(moveAction);

    this.fieldlogic.tiles[row][col] = tile;
  },

  //удаляем клетки с поля
  deleteTiles(arr) {
    arr.forEach(tile => {
      let tileSprite = tile.sprite;
      let action = new cc.MoveTo(0.5, 600, 500);
      let seq = new cc.Sequence(action, cc.callFunc(function (tileSprite) {
        this.removeChild(tileSprite)
      }, this))
      tileSprite.runAction(seq);
      this.fieldlogic.tiles[tile.row][tile.col] = null;
    })
  },

  updateScore(arr) {
    let dif = arr.length * 10;
    let progress = Math.floor(this.score / goal * 100);

    //this.addBar(progress)

    let update = () => {
      this.score++;
      dif--;
      let progress2 = Math.floor(this.score / goal * 100);
      let won = this.score > goal ? true : false;
      if (!won) {
        if (progress2 > progress) {
          this.addBar(progress2)
          progress = progress2
        }
        this.scoreText.setString(this.score + "/" + `${goal}`);
        if (dif === 0) {
          this.unschedule(update)
        }
      }
    }
    this.schedule(update, 0.01);
  },

  addBar(progress) {
    let bars = progress - this.barPosition;
    let startX = 575;
    let startY = 520;
    let barLength = 169 / 100;
    let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
    oneBar.setPosition(startX + this.barPosition * barLength, startY);
    this.addChild(oneBar, 3)
    let moveAction = new cc.MoveTo(0.3, startX + (this.barPosition + bars) * barLength, startY);
    // let seq = new cc.Sequence(moveAction, cc.callFunc(function () {
    for (let i = 0; i < bars; i++) {
      let currentPosition = startX + this.barPosition * barLength;
      let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
      oneBar.setPosition(currentPosition + i * barLength, startY);
      this.addChild(oneBar, 3);
    }
    oneBar.runAction(moveAction);
    this.barPosition += bars;
  },

  //добавляем tile на поле 
  addFieldTiles() {
    let rows = this.fieldlogic.rows;
    let colls = this.fieldlogic.colls;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < colls; j++) {
        let tile = this.fieldlogic.tiles[i][j].sprite;
        tile.setPosition(this.xTailStartOnField + j * this.tileWidthOnField, this.yTailStartOnField + i * this.tileHeightOnField);
        this.addChild(tile, zIndexTiles);
      }
    }
  }
})
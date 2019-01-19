const tileWidthOnField = 53;
const tileHeightOnField = 60;
const xTailStartOnField = 15;
const yTailStartOnField = 13;
const zIndexTiles = 2;
const goal = 1000;


let FieldSprite = cc.Sprite.extend({

  ctor(spriteFrameName) {
    this._super(spriteFrameName);
    this.tiles = [];
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
    this.whatIsFieldSize()
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
    if (pickedTileRowAndCol) {
      let pickedTile = target.tiles[pickedTileRowAndCol.row][pickedTileRowAndCol.col];
      let pickedArr = target.findAllCommonTiles(pickedTile)
      if (pickedArr && pickedArr.length > 0) {
        target.deleteTiles(pickedArr);
        target.updateScore(pickedArr)
      }
      target.moveRemainingTiles();
      target.addNewTiles();
    }
  },

  //находим клетки с пропусками и вызываемcreateNewTile
  addNewTiles() {
    for (let i = 0; i < this.tiles.length; i++) {
      for (let k = 0; k < this.tiles[i].length; k++) {
        if (this.tiles[i][k] === null) {
          let holesUpon = this.tiles.length - i;
          this.createNewTile(i, k, holesUpon)
        }
      }
    }
  },

  //создаём новые клетки и перемещаем их на место где ничего нет
  createNewTile(row, col, holesUpon) {
    let tile = this.createTile(row, col)
    tile.setPosition(xTailStartOnField + col * tileWidthOnField, yTailStartOnField + (row + holesUpon) * tileHeightOnField);
    this.addChild(tile, zIndexTiles);


    let coordX = xTailStartOnField + col * tileWidthOnField;
    let coordY = yTailStartOnField + row * tileHeightOnField;
    let moveAction = new cc.MoveTo(0.4, coordX, coordY);
    tile.runAction(moveAction);

    this.tiles[row][col] = tile;
  },

  //удаляем клетки с поля
  deleteTiles(arr) {
    arr.forEach(tile => {
      let action = new cc.MoveTo(0.5, 600, 500);
      let seq = new cc.Sequence(action, cc.callFunc(function (tile) {
        this.removeChild(tile)
      }, this))
      tile.runAction(seq)
      this.tiles[tile.row][tile.col] = null;
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
    console.log(this.barPosition);
    let bars = progress - this.barPosition;
    let startX = 575;
    let startY = 520;
    let barLength = 169;
    let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
    oneBar.setPosition(startX + this.barPosition * 1.69, 520);
    this.addChild(oneBar, 3)
    let moveAction = new cc.MoveTo(0.3, startX + (this.barPosition + bars) * 1.69, 520);
    // let seq = new cc.Sequence(moveAction, cc.callFunc(function () {
    for (let i = 0; i < bars; i++) {
      let currentPosition = startX + this.barPosition * 1.69;
      let oneBar = new cc.Sprite(res.ONEBAR_IMAGE);
      oneBar.setPosition(currentPosition + i * 1.69, 520);
      this.addChild(oneBar, 3);
    }
    oneBar.runAction(moveAction);
    this.barPosition += bars;
    // }, this))


  },

  //сдвигаем клетки под которомы есть пустоты после удаления
  moveRemainingTiles() {
    for (let i = 1; i < this.tiles.length; i++) {
      for (let k = 0; k < this.tiles[i].length; k++) {
        if (this.tiles[i][k] !== null) {
          let holesBelow = 0;
          for (let m = i - 1; m >= 0; m--) {
            if (this.tiles[m][k] === null) {
              holesBelow++
            }
          }
          if (holesBelow > 0) {
            let coordX = this.tiles[i][k].x;
            let coordY = this.tiles[i][k].y - holesBelow * tileHeightOnField;
            let moveAction = cc.MoveTo.create(0.4, coordX, coordY);
            this.tiles[i][k].runAction(moveAction);
            this.tiles[i - holesBelow][k] = this.tiles[i][k];//содержимое клетки 
            this.tiles[i - holesBelow][k].row = i - holesBelow;//корректируем row для клетки(иначе будет старое значение i)
            this.tiles[i][k] = null;
          }
        }
      }
    }
  },

  //находим row and col с учётом начала tiles
  normalizePick(location) {
    let pickedRow = Math.floor((location.y - yTailStartOnField) / tileHeightOnField);
    let pickedCol = Math.floor((location.x - xTailStartOnField) / tileWidthOnField);
    let tail = { row: pickedRow, col: pickedCol };
    if (this.isWithinField(tail)) {
      return tail;
    }
    return null
  },


  //проверям находится ли клетка внутри игрового поля
  isWithinField(tail) {
    return tail.row >= 0 && tail.row < this.rows && tail.col >= 0 && tail.col < this.cols;
  },


  //проверяем окружение выбранной tile, затем проверям окружение клеток, которые окружают выбранную нами tile  и т.д пока окружение всех клеток не проверим
  findAllCommonTiles(tile) {
    let closestCommonTiles = this.findCommonColorTile(tile);
    if (closestCommonTiles.length > 0) {
      tile.isPicked = true;
      let commonTiles = [tile];
      while (closestCommonTiles.length > 0) {
        for (let i = 0; i < closestCommonTiles.length; i++) {
          closestCommonTiles[i].isPicked = true;
          let closestTilesForCheckedTile = this.findCommonColorTile(closestCommonTiles[i]);
          closestCommonTiles.push(...closestTilesForCheckedTile);
          commonTiles.push(...closestCommonTiles.splice(i, 1))
        }
      }
      return commonTiles
    }
  },


  //проверяме 4 направления выбранной tile
  findCommonColorTile(tile) {
    let tailsWithinField = [];
    let upTilePosition = { row: tile.row + 1, col: tile.col };
    let downTilePosition = { row: tile.row - 1, col: tile.col };
    let leftTilePosition = { row: tile.row, col: tile.col - 1 };
    let rightTilePosition = { row: tile.row, col: tile.col + 1 };

    if (this.isWithinField(upTilePosition)) tailsWithinField.push(upTilePosition);
    if (this.isWithinField(downTilePosition)) tailsWithinField.push(downTilePosition);
    if (this.isWithinField(leftTilePosition)) tailsWithinField.push(leftTilePosition);
    if (this.isWithinField(rightTilePosition)) tailsWithinField.push(rightTilePosition);
    let commonColorTails = tailsWithinField
      .filter(el => this.tiles[el.row][el.col].collorPng === tile.collorPng)
      .map(el => this.tiles[el.row][el.col])
      .filter(tile => !tile.isPicked)
    return commonColorTails;

  },

  whatIsFieldSize() {
    this.rows = Math.floor(this.width / tileWidthOnField);
    this.cols = Math.floor(this.height / tileHeightOnField);
  },

  //добавляем tile на поле и создаём двумерный массив отражающий игрове поле
  addFieldTiles() {
    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        let tile = this.createTile(row, col);
        tile.setPosition(xTailStartOnField + col * tileWidthOnField, yTailStartOnField + row * tileHeightOnField);
        this.addChild(tile, zIndexTiles);
        this.tiles[row].push(tile);
      }
    }
  },

  createTile(row, col) {
    let fileName = this.findRandomColorForTile();
    let tile = new TileSprite(fileName, row, col);
    tile.setAnchorPoint(0, 0)
    return tile;
  },

  //находим рандомный цвет для ячейки
  findRandomColorForTile() {
    let tilesFiles = [
      res.BTILE_IMAGE,
      res.GTILE_IMAGE,
      res.PTILE_IMAGE,
      res.RTILE_IMAGE,
      res.YTILE_IMAGE];
    let fileNameNumber = Math.floor(Math.random() * tilesFiles.length)
    return tilesFiles[fileNameNumber]
  }


})


let FieldSprite = cc.Sprite.extend({
  ctor(spriteFrameName, logic, rows, colls, startGridX, startGridY) {
    this._super(spriteFrameName);
    this.xTailStartOnField = startGridX;
    this.yTailStartOnField = startGridY;
    this.fieldlogic = new logic(rows, colls);
    this.addFieldTiles();
  },


  //находим row and col с учётом начала tiles
  normalizePick(location) {
    let pickedRow = Math.floor((location.y - this.yTailStartOnField + this.tileHeightOnField / 2) / this.tileHeightOnField);
    let pickedCol = Math.floor((location.x - this.xTailStartOnField + this.tileWidthOnField / 2) / this.tileWidthOnField);
    let tail = { row: pickedRow, col: pickedCol };
    return tail;
  },

  //сдвигаем клетки под которомы есть пустоты после удаления
  moveRemainingTiles() {
    let movingTiles = this.fieldlogic.whichTilesNeedMove();
    movingTiles.forEach(tileToMove => {
      let tile = tileToMove.tile;
      let holesBelow = tileToMove.holesBelow;
      let coordX = tile.sprite.x;
      let coordY = tile.sprite.y - holesBelow * this.tileHeightOnField;
      let moveAction = new cc.MoveTo(0.4, coordX, coordY);
      tile.sprite.runAction(moveAction);
    })


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
    tile.sprite.setPosition(this.xTailStartOnField + col * this.tileWidthOnField, this.yTailStartOnField + (row + holesUpon) * this.tileHeightOnField);
    if (tile.isSuperTile) {
      this.foreverAnimationForSuperTile(tile.sprite);
      this.addChild(tile.sprite, tile.zIndex + 1);
    } else {
      this.addChild(tile.sprite, tile.zIndex);
    }


    let coordX = this.xTailStartOnField + col * this.tileWidthOnField;
    let coordY = this.yTailStartOnField + row * this.tileHeightOnField;
    let moveAction = new cc.MoveTo(0.4, coordX, coordY);
    tile.sprite.runAction(moveAction);
    this.fieldlogic.tiles[row][col] = tile;
  },

  //удаляем клетки с поля
  deleteTiles(arr) {
    arr.forEach(tile => {
      let tileSprite = tile.sprite;
      let action = new cc.MoveTo(0.5, 626.5, 530);
      let seq = new cc.Sequence(action, cc.callFunc(function (tileSprite) {
        this.removeChild(tileSprite)
      }, this))
      tileSprite.runAction(seq);
      this.fieldlogic.tiles[tile.row][tile.col] = null;

      if (tile.isSuperTile) {
        this.createSuperTile(tile);
      }
    })
  },



  createSuperTile(tile) {
    let superTile = this.fieldlogic.createSuperTile(tile);
    superTile.sprite.setPosition(this.xTailStartOnField + superTile.col * this.tileWidthOnField, this.yTailStartOnField + superTile.row * this.tileHeightOnField);
    this.addChild(superTile.sprite, tile.zIndex + 1);
    let actionUp = new cc.ScaleTo(0.1, 1.4, 1.4);
    let actionDown = new cc.ScaleTo(0.1, 1, 1);
    let seq = new cc.Sequence([actionUp, actionDown]);
    superTile.sprite.runAction(seq);
    this.foreverAnimationForSuperTile(superTile.sprite);

  },

  //добавляем tile на поле 
  addFieldTiles() {
    let rows = this.fieldlogic.rows;
    let colls = this.fieldlogic.colls;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < colls; j++) {
        let tile = this.fieldlogic.tiles[i][j].sprite;
        this.tileWidthOnField = tile.width;
        this.tileHeightOnField = tile.height;
        tile.setPosition(this.xTailStartOnField + j * this.tileWidthOnField, this.yTailStartOnField + i * this.tileHeightOnField);
        if (this.fieldlogic.tiles[i][j].isSuperTile) {
          this.foreverAnimationForSuperTile(tile);
          this.addChild(tile, tile.zIndex + 1);
        } else {
          this.addChild(tile, tile.zIndex);
        }
      }
    }
  },

  foreverAnimationForSuperTile(tileSprite) {
    let actionUp = new cc.ScaleTo(0.75, 1.07, 1.07);
    let actionDown = new cc.ScaleTo(0.75, 1, 1);
    let seq = new cc.Sequence([actionUp, actionDown]);
    var repeatForever = new cc.RepeatForever(seq);
    tileSprite.runAction(repeatForever);
  },

  animationForSuperTiles(arr, cb) {
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) {
        arr[i].sprite.runAction(cc.sequence(cc.scaleTo(0.5, 3, 3), cc.scaleTo(0.1, 1, 1), cc.callFunc(cb, this)));
      }
      arr[i].sprite.runAction(cc.sequence(cc.scaleTo(0.5, 3, 3), cc.scaleTo(0.1, 1, 1)));
    }
  }
})


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
    let pickedRow = Math.floor((location.y - this.yTailStartOnField) / this.tileHeightOnField);
    let pickedCol = Math.floor((location.x - this.xTailStartOnField) / this.tileWidthOnField);
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
    this.addChild(tile.sprite, tile.zIndex);


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
      let action = new cc.MoveTo(0.5, 600, 500);
      let seq = new cc.Sequence(action, cc.callFunc(function (tileSprite) {
        this.removeChild(tileSprite)
      }, this))
      tileSprite.runAction(seq);
      this.fieldlogic.tiles[tile.row][tile.col] = null;
    })
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
        this.addChild(tile, tile.zIndex);
      }
    }
  }
})
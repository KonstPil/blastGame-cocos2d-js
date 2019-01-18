let FieldSprite = cc.Sprite.extend({

  ctor(spriteFrameName) {
    this._super(spriteFrameName);
    this._tiles = [];
    this.init();

  },

  init() {
    cc.eventManager.addListener({
      event: cc.EventListener.TOUCH_ONE_BY_ONE,
      swallowTouches: true,
      onTouchBegan: this.onTouchBegan,
    }, this)
    this.whatIsFieldSize()
  },


  onTouchBegan(touch, event) {
    let target = event.getCurrentTarget();
    let location = target.convertToNodeSpace(touch.getLocation());//находим координаты относительно field
    let pickedTileRowAndCol = target.normalizePick(location);
    if (pickedTileRowAndCol) {
      let pickedTile = target._tiles[pickedTileRowAndCol.row][pickedTileRowAndCol.col];
      let pickedArr = target.findAllCommonTiles(pickedTile)
      if (pickedArr.length > 1) {
        pickedArr.forEach(tile => {
          target.removeChild(tile)
          tile = null;
        })
        console.log(target._tiles);

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
    tile.isPicked = true;
    let commonTiles = [tile];
    let closestCommonTiles = this.findCommonColorTile(tile);
    while (closestCommonTiles.length > 0) {
      for (let i = 0; i < closestCommonTiles.length; i++) {
        closestCommonTiles[i].isPicked = true;
        let closestTilesForCheckedTile = this.findCommonColorTile(closestCommonTiles[i]);
        closestCommonTiles.push(...closestTilesForCheckedTile);
        commonTiles.push(...closestCommonTiles.splice(i, 1))
      }
    }
    return commonTiles
  },


  //проверяме 4 направления выбранной tile
  findCommonColorTile(tile) {
    let tailsWithinWield = [tile];
    let upTilePosition = { row: tile.row + 1, col: tile.col };
    let downTilePosition = { row: tile.row - 1, col: tile.col };
    let leftTilePosition = { row: tile.row, col: tile.col - 1 };
    let rightTilePosition = { row: tile.row, col: tile.col + 1 };

    if (this.isWithinField(upTilePosition)) tailsWithinWield.push(upTilePosition);
    if (this.isWithinField(downTilePosition)) tailsWithinWield.push(downTilePosition);
    if (this.isWithinField(leftTilePosition)) tailsWithinWield.push(leftTilePosition);
    if (this.isWithinField(rightTilePosition)) tailsWithinWield.push(rightTilePosition);
    let commonColorTails = tailsWithinWield
      .filter(el => this._tiles[el.row][el.col].collorPng === tile.collorPng)
      .map(el => this._tiles[el.row][el.col])
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
      this._tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        let fileName = this.findRandomColorForTile();
        let tile = new TileSprite(fileName, row, col);
        this._tiles[row].push(tile)
        this.addChild(tile, zIndexTiles);
        tile.setPosition(xTailStartOnField + col * tileWidthOnField, yTailStartOnField + row * tileHeightOnField);
        tile.setAnchorPoint(0, 0)
      }
    }
  },

  //находим рандомный цвет для ячейки
  findRandomColorForTile() {
    tilesFiles = [
      res.BTILE_IMAGE,
      res.GTILE_IMAGE,
      res.PTILE_IMAGE,
      res.RTILE_IMAGE,
      res.YTILE_IMAGE];
    let fileNameNumber = Math.floor(Math.random() * tilesFiles.length)
    return tilesFiles[fileNameNumber]
  }
})
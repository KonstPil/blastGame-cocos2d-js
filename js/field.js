let FieldSprite = cc.Sprite.extend({
  ctor(spriteFrameName) {
    this._super(spriteFrameName);
  },

  addFieldTiles() {
    let tileWidth = 53;
    let tileHeight = 60;
    let tilesInRow = Math.floor(this.width / tileWidth);
    let tilesInCol = Math.floor(this.height / tileHeight);
    let allTiles = tilesInRow * tilesInCol;
    let xStartPoint = 15;
    let yStartPoint = 13;
    for (let i = 0; i < allTiles; i++) {
      let fileName = this.findRandomTiles();
      let tile = cc.Sprite.create(fileName);
      this.addChild(tile, zIndexTiles);
      tile.setPosition(xStartPoint + i % tilesInRow * tileWidth, yStartPoint + Math.floor(i / tilesInRow) * tileHeight);
      tile.setAnchorPoint(0, 0)

    }
  },

  findRandomTiles() {
    let tilesArray = [res.BTILE_IMAGE, res.GTILE_IMAGE, res.PTILE_IMAGE, res.RTILE_IMAGE, res.YTILE_IMAGE];
    let fileNameNumber = Math.floor(Math.random() * tilesArray.length)
    return tilesArray[fileNameNumber]
  }
})
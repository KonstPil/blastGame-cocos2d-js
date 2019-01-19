class Display{
  constructor(){

  }
  createTile(row, col) {
    let fileName = this.findRandomColorForTile();
    let tile = new TileSprite(fileName, row, col);
    tile.setAnchorPoint(0, 0)
    this.addChild(tile, zIndexTiles);
    return tile;
  }

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
}
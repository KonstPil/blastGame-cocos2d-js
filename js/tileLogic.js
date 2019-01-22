class Tile {
  constructor(file, row, col, colorIndex, isSuperTile) {
    this.file = file;
    this.colorIndex = colorIndex;
    this.row = row;
    this.col = col;
    this.isPicked = false;
    this.isHole = false;
    this.isSuperTile = isSuperTile;
    this.init();
  }

  init() {
    this.sprite = new cc.Sprite(this.file);
  }
}
class Tile {
  constructor(file, row, col, colorIndex, zIndex) {
    this.file = file;
    this.zIndex = zIndex;
    this.colorIndex = colorIndex;
    this.row = row;
    this.col = col;
    this.isPicked = false;
    this.isHole = false;
    this.init();
  }

  init() {
    this.sprite = new cc.Sprite(this.file);
    this.sprite.setAnchorPoint(0, 0)
  }
}
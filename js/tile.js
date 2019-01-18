let TileSprite = cc.Sprite.extend({
  ctor(spriteFrameName, row, col) {
    this._super(spriteFrameName);
    this.row = row;
    this.col = col;
    this.collorPng = spriteFrameName;
    this.isPicked = false;
  }

})
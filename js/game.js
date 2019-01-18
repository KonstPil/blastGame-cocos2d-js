

let GameLayer = cc.Layer.extend({
  ctor() {
    this._super();
    this.init();
  },

  init() {
    this._super();
    //размер окна
    let size = cc.director.getWinSize();
    //устанавливаем bg
    let background = cc.LayerColor.create(new cc.Color(160, 160, 160, 255),
      size.width, size.height);
    this.addChild(background, zIndexBG);//z-index для слоя 
    //устанавливаем field and tiles
    this.fieldSprite = new FieldSprite(res.FIELD_IMAGE);
    this.fieldSprite.setPosition(18, 18);
    this.fieldSprite.setAnchorPoint(0, 0)
    this.addChild(this.fieldSprite, zIndexField);//z-index для слоя 
    this.fieldSprite.addFieldTiles();
  },

  onEnter() {
    this._super();
  },

})

GameLayer.scene = function () {
  let scene = new cc.Scene();
  let layer = new GameLayer();
  scene.addChild(layer);
  return scene;
}


window.onload = function () {

  cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.
      SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
      cc.director.runScene(GameLayer.scene());
    }, this);
  };
  cc.game.run("gameCanvas");
};
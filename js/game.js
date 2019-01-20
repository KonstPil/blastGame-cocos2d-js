

let GameLayer = cc.Layer.extend({
  ctor() {
    this._super();
    this.init();
  },

  init() {
    //размер окна
    let size = cc.director.getWinSize();
    //устанавливаем bg
    let background = cc.LayerColor.create(new cc.Color(160, 160, 160, 255),
      size.width, size.height);
    this.addChild(background, 0);//z-index для слоя 
    //устанавливаем field and tiles
    let fieldSprite = new FieldSprite(res.FIELD_IMAGE, Field, 9, 9);
    fieldSprite.setPosition(18, 18);
    fieldSprite.setAnchorPoint(0, 0)
    this.addChild(fieldSprite, 1);//z-index для слоя 
    //
    let progressBar = new cc.Sprite(res.PROGRESS_IMAGE);
    progressBar.setPosition(660, 545);
    fieldSprite.addChild(progressBar, 1);
    //

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


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
    this.fieldSprite = new FieldSprite(res.FIELD_IMAGE, Field, 9, 9, 15, 13);
    this.fieldSprite.setPosition(18, 18);
    this.fieldSprite.setAnchorPoint(0, 0);
    this.addChild(this.fieldSprite, 1);//z-index для слоя 
    //
    this.progressBar = new ProgressBar(res.PROGRESS_IMAGE);
    this.progressBar.sprite.setPosition(660, 545);
    this.addChild(this.progressBar.sprite, 1);
    //

  },


})

function scene() {
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
      cc.director.runScene(scene());
    }, this);
  };
  cc.game.run("gameCanvas");
};
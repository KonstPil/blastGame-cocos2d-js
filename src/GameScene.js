let GameScene = (function () {
  const zIndexGameLayer = 0;
  const zIndexUILayer = 1;
  const xCoordStartGameLayer = 18;
  const yCoordStartGameLayer = 18;

  let GameScene = cc.Scene.extend({
    onEnter: function () {
      this._super();
      this.addChild(new GameLayer(xCoordStartGameLayer, yCoordStartGameLayer), zIndexGameLayer);
      this.addChild(new UILayer(), zIndexUILayer);
    }
  });
  return GameScene;
}())
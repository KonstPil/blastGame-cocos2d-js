
window.onload = function () {
  cc.game.onStart = function () {
    cc.view.setDesignResolutionSize(800, 600, cc.ResolutionPolicy.
      SHOW_ALL);
    cc.view.resizeWithBrowserSize(true);
    //load resources
    cc.LoaderScene.preload(g_resources, function () {
      cc.director.runScene(new cc.TransitionShrinkGrow(2.0, new GameScene()));
    }, this);
  };
  cc.game.run("gameCanvas");
};
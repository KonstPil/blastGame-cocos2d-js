let UILayer = (function () {
  const restartTransitionTime = 2;//времня на анимацию перерхода
  const xPositionForRestartButton = 660;//x координата для кнопки рестарт
  const yPositionForRestartButton = 70;//y координата для кнопки рестарт

  let UILayer = cc.Layer.extend({
    ctor() {
      this._super();
      this.createScreen();
    },
    createScreen() {

      let restartButton = new Button('restart', function () {
        cc.director.runScene(new cc.TransitionFadeBL(restartTransitionTime, new GameScene()));
      });

      restartButton.setPosition(xPositionForRestartButton, yPositionForRestartButton);
      this.addChild(restartButton);
    }
  })
  return UILayer
}())



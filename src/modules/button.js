let Button = (function () {
  const fontSizeForTextButton = 32;
  const xPositionForTextInButton = 77;
  const yPositionForTextInButton = 15;


  let Button = ccui.Button.extend({
    ctor(caption, callback) {
      this._super();
      this.init(caption);
      this.createListeners(callback)
    },

    init(caption) {
      this.loadTextures(res.RESBUTTON_IMAGE, res.RESBUTTONA_IMAGE);
      let captionLabel = new cc.LabelTTF(caption, "Coiny", fontSizeForTextButton);
      captionLabel.setPosition(xPositionForTextInButton, yPositionForTextInButton);
      this.addChild(captionLabel);
    },

    createListeners(callback) {
      this.addTouchEventListener(this.touchEvent(callback), this);
    },

    touchEvent(callback) {
      return function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED) {
          callback();
        }
      };
    }
  });
  return Button
}())
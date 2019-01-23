let FieldSprite = (function () {
  const moveDownAfterDeleteTime = 0.4;//время анимации, после удаления, сдвиг верхних клеток вниз
  const moveDownNewTilesAfterDelete = 0.4;//время анимации, после удаления, сдвиг новых клеток вниз
  //анимация для удаления 
  const moveAfterDelete = 0.5;//время анимации, перемещение в сторону прогрес бара
  const XcoordWhereTilesGoing = 626.5;//коорд х, точка перемещения для анимации,после удаления, под прогресс баром
  const YcoordWhereTilesGoing = 530;//коорд y, точка перемещения для анимации,после удаления, под прогресс баром
  //z-index
  const zIndexPoints = 5;
  const zIndexTile = 1;
  const zIndexSuperTile = zIndexTile + 1;
  //points Animation
  const movingTimeForPoint = 0.4;//время анимации, перемещение набранныз очков
  const XcoordWherePointGoing = 0;//коорд х, точка перемещения для анимации
  const YcoordWherePointGoing = 70;//коорд y, точка перемещения для анимации
  const fontSize = 24;//размер шрифта для points
  //create Supertile animation 
  const timeForAnimationScaleTo = 0.1;//время для увеличения и уменьшения при создании супер тайла
  const superTileCreateScale = 1.5; // размер увеличения при создании супер тайла по х и у
  // standart size for all Scale animation
  const standartSize = 1;//стандартный размер для тайл
  //foreverAnimation for super Tile
  const timeForSizeUpDown = 0.75;//время для анимации увеличения и уменьшения
  const foreverAnimationScale = 1.07;//до каких размеров будет увеличиваться supertile
  //animation For supetTile boom 
  const timeForBoomScaleUp = 0.5;//время увеличения tail при анимации взрыва superTile
  const scaleSizeForBoom = 3;//размер до которго увеличивается superTile
  //animation For supetTile boom 
  const timeForNormalScaleUp = 0.35;//время увеличения tail при анимации обычных тайлов
  const scaleSizeForNormal = 0.5;//размер до которго уменьшаются обычные тайлы


  let FieldSprite = cc.Sprite.extend({
    ctor(spriteFrameName, logic, rows, colls, startGridX, startGridY) {
      this._super(spriteFrameName);
      this.xTailStartOnField = startGridX;
      this.yTailStartOnField = startGridY;
      this.fieldlogic = new logic(rows, colls);
      this.addFieldTiles();
    },


    //находим row and col с учётом начала tiles
    normalizePick(location) {
      let pickedRow = Math.floor((location.y - this.yTailStartOnField + this.tileHeightOnField / 2) / this.tileHeightOnField);
      let pickedCol = Math.floor((location.x - this.xTailStartOnField + this.tileWidthOnField / 2) / this.tileWidthOnField);
      let tail = { row: pickedRow, col: pickedCol };
      return tail;
    },

    //сдвигаем клетки под которомы есть пустоты после удаления
    moveRemainingTiles() {
      let movingTiles = this.fieldlogic.whichTilesNeedMove();
      movingTiles.forEach(tileToMove => {
        let tile = tileToMove.tile;
        let holesBelow = tileToMove.holesBelow;
        let coordX = tile.sprite.x;
        let coordY = tile.sprite.y - holesBelow * this.tileHeightOnField;
        let moveAction = new cc.MoveTo(moveDownAfterDeleteTime, coordX, coordY);
        tile.sprite.runAction(moveAction);
      })


    },
    //находим клетки с пропусками и вызываемcreateNewTile
    addNewTiles() {
      for (let i = 0; i < this.fieldlogic.rows; i++) {
        for (let k = 0; k < this.fieldlogic.colls; k++) {
          if (this.fieldlogic.tiles[i][k] === null) {
            let holesUpon = this.fieldlogic.rows - i;
            this.createNewTile(i, k, holesUpon)
          }
        }
      }
    },

    //создаём новые клетки и перемещаем их на место где ничего нет
    createNewTile(row, col, holesUpon) {
      let tile = this.fieldlogic.createOneTile(row, col);
      tile.sprite.setPosition(this.xTailStartOnField + col * this.tileWidthOnField, this.yTailStartOnField + (row + holesUpon) * this.tileHeightOnField);
      if (tile.isSuperTile) {
        this.foreverAnimationForSuperTile(tile.sprite);
        this.addChild(tile.sprite, zIndexSuperTile);
      } else {
        this.addChild(tile.sprite, zIndexTile);
      }


      let coordX = this.xTailStartOnField + col * this.tileWidthOnField;
      let coordY = this.yTailStartOnField + row * this.tileHeightOnField;
      let moveAction = new cc.MoveTo(moveDownNewTilesAfterDelete, coordX, coordY);
      tile.sprite.runAction(moveAction);
      this.fieldlogic.tiles[row][col] = tile;
    },

    //удаляем клетки с поля
    deleteTiles(arr) {
      arr.forEach(tile => {
        let tileSprite = tile.sprite;
        let action = new cc.MoveTo(moveAfterDelete, XcoordWhereTilesGoing, YcoordWhereTilesGoing);
        let seq = new cc.Sequence(action, cc.callFunc(function (tileSprite) {
          this.removeChild(tileSprite)
        }, this))
        tileSprite.runAction(seq);
        this.fieldlogic.tiles[tile.row][tile.col] = null;

        if (tile.isSuperTile) {
          this.createSuperTile(tile);
        }
      })
    },


    addPoints(arr, loc, points) {
      let pointsValue = arr.length * points;
      let pointsText = new cc.LabelTTF("+" + pointsValue, "Coiny", fontSize, cc.TEXT_ALIGNMENT_CENTER);
      this.addChild(pointsText, zIndexPoints);
      pointsText.setPosition(loc.x, loc.y);
      let moveAction = new cc.MoveBy(movingTimeForPoint, XcoordWherePointGoing, YcoordWherePointGoing);
      let seq = new cc.Sequence(moveAction, cc.callFunc(function (pointsText) {
        this.removeChild(pointsText)
      }, this));
      pointsText.runAction(seq);
    },


    createSuperTile(tile) {
      let superTile = this.fieldlogic.createSuperTile(tile);
      superTile.sprite.setPosition(this.xTailStartOnField + superTile.col * this.tileWidthOnField, this.yTailStartOnField + superTile.row * this.tileHeightOnField);
      this.addChild(superTile.sprite, zIndexSuperTile);
      let actionUp = new cc.ScaleTo(timeForAnimationScaleTo, superTileCreateScale, superTileCreateScale);
      let actionDown = new cc.ScaleTo(timeForAnimationScaleTo, standartSize, standartSize);
      this.animationForCreateSuperTile = new cc.Sequence(actionUp, actionDown, cc.callFunc(function () {
        let sprite = superTile.sprite;
        this.foreverAnimationForSuperTile(sprite);

      }, this));
      superTile.sprite.runAction(this.animationForCreateSuperTile);


    },

    //добавляем tile на поле 
    addFieldTiles() {
      let rows = this.fieldlogic.rows;
      let colls = this.fieldlogic.colls;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < colls; j++) {
          let tile = this.fieldlogic.tiles[i][j].sprite;
          this.tileWidthOnField = tile.width;
          this.tileHeightOnField = tile.height;
          tile.setPosition(this.xTailStartOnField + j * this.tileWidthOnField, this.yTailStartOnField + i * this.tileHeightOnField);
          if (this.fieldlogic.tiles[i][j].isSuperTile) {
            this.foreverAnimationForSuperTile(tile);
            this.addChild(tile, zIndexSuperTile);
          } else {
            this.addChild(tile, zIndexTile);
          }
        }
      }
    },

    foreverAnimationForSuperTile(tile) {
      let actionUp = new cc.ScaleTo(timeForSizeUpDown, foreverAnimationScale, foreverAnimationScale);
      let actionDown = new cc.ScaleTo(timeForSizeUpDown, standartSize, standartSize);
      let seq = new cc.Sequence([actionUp, actionDown]);
      var repeatForever = new cc.RepeatForever(seq);
      tile.runAction(repeatForever);
    },

    animationForSuperTiles(arr, cb) {
      for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
          arr[i].sprite.runAction(cc.sequence(cc.scaleTo(timeForBoomScaleUp, scaleSizeForBoom, scaleSizeForBoom), cc.callFunc(cb, this)));
        }
        arr[i].sprite.runAction(cc.sequence(cc.scaleTo(timeForBoomScaleUp, scaleSizeForBoom, scaleSizeForBoom)));
      }
    },

    animationForNormalTiles(arr, cb) {
      for (let i = 0; i < arr.length; i++) {
        if (i === arr.length - 1) {
          arr[i].sprite.runAction(cc.sequence(cc.scaleTo(timeForNormalScaleUp, scaleSizeForNormal, scaleSizeForNormal), cc.callFunc(cb, this)));
        }
        arr[i].sprite.runAction(cc.sequence(cc.scaleTo(timeForNormalScaleUp, scaleSizeForNormal, scaleSizeForNormal)));
      }
    }

  })
  return FieldSprite
}())

let fieldLogic = (function () {
  const colorIndexForSuperTile = 0;
  const radiusAroundSuperTileForDelete = 1;//радиус вокруг супер тайла, т.е клетки коготорые мы будем удалять
  const tilesForCreateSuperTile = 6;//сколько тайлов одинакового цвета надо для создания супер тайла
  const oddsForSuperTileCreation = 0.011;//вероятность появления супер тайлов на поле (макс значение 1)

  class Field {
    constructor(rows, colls) {
      this.rows = rows;
      this.colls = colls;
      this.tiles = [];
      this.createTilesArray();
    }

    /**
     * находим массив клеток которые необходимо удалить (одного цвета или под супер tile)
     * @param {Object} pickedTileCoord представляет col and row клетки на которую нажали
     * @return {Object}  массив и дополнительные данные о нём(нажали на супер тайл или нет, если да то ещё массив со всеми супер тайлами в радиусе взрыва)
     */
    findTiles(pickedTileCoord) {
      let arrInfo = {};
      if (this.isWithinField(pickedTileCoord)) {
        let pickedTile = this.tiles[pickedTileCoord.row][pickedTileCoord.col];
        if (pickedTile.isSuperTile) {
          let boomObj = this.superTileAction(pickedTile, radiusAroundSuperTileForDelete);;
          arrInfo.arr = boomObj.boomArr;
          arrInfo.isSuperTileWasPicked = true;//superTile
          arrInfo.superTiles = boomObj.superTiles;

        } else {
          let pickedArr = this.findAllCommonTiles(pickedTile, tilesForCreateSuperTile)
          arrInfo.arr = pickedArr;
          arrInfo.isSuperTileWasPicked = false;//superTile
        }

      }
      return arrInfo
    }

    /**
     * проверяем 1 супер тайл если, добавляем массив для удаления все клетки в заданном радиусе, если в радиусе есть ещё 1 супер тайл то проверям его и так же добавляем в массив все клетки для удаления и так пока в радиусе не останутся супер тайлы
     * @param {Object} tile клетка со всеми свойствами
     * @param {Number} radius в каком радиусе от супертайл будут выбираться клетки 
     * @return {Object}  массив с клетками для удаления и все супер тайлы которые находятся в радиусе друг друга
     */
    superTileAction(tile, radius) {
      let superTiles = [];
      let boomArr = this.tilesForSuperTileBoom(tile, radius);
      let tilesForCheck = boomArr.filter(tile => tile.isSuperTile);
      while (tilesForCheck.length > 0) {

        for (let i = 0; i < tilesForCheck.length; i++) {
          let tile = tilesForCheck[i];
          tile.isSuperTile = false;
          let detonateNear = this.tilesForSuperTileBoom(tile, radius);
          boomArr.push(...detonateNear.filter(tile => !boomArr.includes(tile)));
          tilesForCheck.push(...detonateNear.filter(tile => tile.isSuperTile && !tilesForCheck.includes(tile)))
          tilesForCheck.splice(i, 1);
          superTiles.push(tile)
        }

      }
      return { boomArr, superTiles }
    }

    /**
    * добавляем в массив все клетки в заданном радиусе
    * @param {Object} tile клетка со всеми свойствами
    * @param {Number} radius в каком радиусе от супертайл будут выбираться клетки 
    * @return {Array}  массив с клетками для удаления 
    */
    tilesForSuperTileBoom(superTile, radius) {
      let boomArr = [];
      for (let i = superTile.row - radius; i <= superTile.row + radius; i++) {
        for (let k = superTile.col - radius; k <= superTile.col + radius; k++) {
          if (this.isWithinField({ row: i, col: k }) && this.tiles[i][k]) {
            boomArr.push(this.tiles[i][k])
          }
        }
      }
      return boomArr
    }


    /**
    * создаём двумерный массив и заполняем его тайлами которые создаём в createOneTile()
    */
    createTilesArray() {
      for (let row = 0; row < this.rows; row++) {
        this.tiles[row] = [];
        for (let col = 0; col < this.colls; col++) {
          let tile = this.createOneTile(row, col);
          this.tiles[row].push(tile);
        }
      }
    }

    /**
     * создаём тайл
     * @param {Number} row в каком ряду создаём клетку
     * @param {Number} col в каком столбце создаём клетку
     * @return {Object}  клетка со всеми свойствами
     */
    createOneTile(row, col) {
      let tileInfo = this.findRandomTile();
      let tile = new Tile(tileInfo.file, row, col, tileInfo.colorIndex, tileInfo.isSuperTile);
      return tile
    }

    /**
     * создаём супер тайл
     * @param {Object} tile клетка на месте которой мы будем создавать супер тайл
     * @return {Object}  супер клетка со всеми свойствами
     */
    createSuperTile(tile) {
      let superTile = new Tile(res.BOMB_IMAGE, tile.row, tile.col, colorIndexForSuperTile, true);
      this.tiles[tile.row][tile.col] = superTile;
      return superTile
    }

    /**
    * проверям находится ли координаты внутри игрового поля
    * @param {Object} tile координаты 
    * @return {Boolean}  находится внутри поля или нет
    */
    isWithinField(tile) {
      return tile.row >= 0 && tile.row < this.rows && tile.col >= 0 && tile.col < this.colls;
    }



    /**
   * поиск клеток одинакого цвета, для этого: проверяем окружение выбранной tile, затем проверям окружение клеток, которые окружают выбранную нами tile  и т.д пока окружение всех клеток не проверим
   * @param {Object} tile тайл на которую нажали
   * @param {Number} tilesForSuperTile сколько тайлов должно быть чтобы на месте нажатой тайл появилась супер тайл
   * @return {Array} массив со всеми тайлами одного цвета
   */
    findAllCommonTiles(tile, tilesForSuperTile) {
      let closestCommonTiles = this.findCommonColorTile(tile);

      if (closestCommonTiles.length > 0) {
        let commonTiles = [tile];
        while (closestCommonTiles.length > 0) {
          for (let i = 0; i < closestCommonTiles.length; i++) {
            let closestTilesForCheckedTile = this.findCommonColorTile(closestCommonTiles[i]);
            let filterArr = closestTilesForCheckedTile.filter(el => !closestCommonTiles.includes(el));//фильтруем чтобы избежать повторное добавление
            closestCommonTiles.push(...filterArr);
            commonTiles.push(...closestCommonTiles.splice(i, 1))
          }
        }
        if (commonTiles.length >= tilesForSuperTile) {
          tile.isSuperTile = true;
        }
        return commonTiles
      }
    }


    /**
   * проверям выбранную клетку по 4 направления на наличие клеток одинакого цвета
   * @param {Object} tile тайл которую проверям
   * @return {Array} массив со всеми подходящими тайлами
   */
    findCommonColorTile(tile) {
      tile.isPicked = true;
      let tailsWithinField = [];
      let upTilePosition = { row: tile.row + 1, col: tile.col };
      let downTilePosition = { row: tile.row - 1, col: tile.col };
      let leftTilePosition = { row: tile.row, col: tile.col - 1 };
      let rightTilePosition = { row: tile.row, col: tile.col + 1 };

      if (this.isWithinField(upTilePosition)) tailsWithinField.push(upTilePosition);
      if (this.isWithinField(downTilePosition)) tailsWithinField.push(downTilePosition);
      if (this.isWithinField(leftTilePosition)) tailsWithinField.push(leftTilePosition);
      if (this.isWithinField(rightTilePosition)) tailsWithinField.push(rightTilePosition);
      let commonColorTails = tailsWithinField
        .filter(el => this.tiles[el.row][el.col].colorIndex === tile.colorIndex)
        .map(el => this.tiles[el.row][el.col])
        .filter(tile => !tile.isPicked)
      return commonColorTails;

    }

    /**
   * в двумерном массиве переставляем клетки под которыми null т.е пустоты
   * @return {Array} массив со всеми тайлами которые надо передвинуть и на сколько (для анимации)
   */
    whichTilesNeedMove() {
      let tilesToMove = [];
      for (let i = 1; i < this.rows; i++) {
        for (let k = 0; k < this.colls; k++) {
          if (this.tiles[i][k] !== null) {
            let holesBelow = 0;
            for (let m = i - 1; m >= 0; m--) {
              if (this.tiles[m][k] === null) {
                holesBelow++
              }
            }
            if (holesBelow > 0) {
              tilesToMove.push({ tile: this.tiles[i][k], holesBelow })
              //
              this.tiles[i - holesBelow][k] = this.tiles[i][k];//содержимое клетки 
              this.tiles[i - holesBelow][k].row = i - holesBelow;//корректируем row для клетки(иначе будет старое значение i)
              this.tiles[i][k] = null;
            }
          }
        }
      }
      return tilesToMove
    }

    /**
  * находим рандомную клетку которую будем добавлять 
  * @return {Object} цвет, супертайл или нет, и цветовой индекс
  */
    findRandomTile() {
      let tile;
      let randomNumber = Math.random();
      if (randomNumber < oddsForSuperTileCreation) {
        tile = { file: res.BOMB_IMAGE, colorIndex: colorIndexForSuperTile, isSuperTile: true }
      } else {
        let tilesFiles = [
          { file: res.BTILE_IMAGE, colorIndex: 1, isSuperTile: false },
          { file: res.GTILE_IMAGE, colorIndex: 2, isSuperTile: false },
          { file: res.PTILE_IMAGE, colorIndex: 3, isSuperTile: false },
          { file: res.RTILE_IMAGE, colorIndex: 4, isSuperTile: false },
          { file: res.YTILE_IMAGE, colorIndex: 5, isSuperTile: false }];
        tile = tilesFiles[Math.floor(randomNumber * tilesFiles.length)];
      }
      return tile;
    }
  }
  return Field
}());
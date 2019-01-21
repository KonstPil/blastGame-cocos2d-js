class Field {
  constructor(rows, colls) {
    this.rows = rows;
    this.colls = colls;
    this.tiles = [];
    this.createTilesArray();
  }

  findTiles(pickedTileCoord) {
    let arrInfo = {};
    if (this.isWithinField(pickedTileCoord)) {
      let pickedTile = this.tiles[pickedTileCoord.row][pickedTileCoord.col];
      if (pickedTile.isSuperTile) {
        let boomObj = this.superTileAction(pickedTile, 1);;
        arrInfo.arr = boomObj.boomArr;
        arrInfo.type = 2;//superTile
        arrInfo.superTiles = boomObj.superTiles;

      } else {
        let pickedArr = this.findAllCommonTiles(pickedTile, 2)
        arrInfo.arr = pickedArr;
        arrInfo.type = 1;//superTile
      }

    }
    return arrInfo
  }

  //взрываем клетки вокруг superTile и если в радиусе есть ещё 1 superTIle детонируем и его
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


  //добавляем tile на поле и создаём двумерный массив отражающий игрове поле
  createTilesArray() {
    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.colls; col++) {
        let tile = this.createOneTile(row, col);
        this.tiles[row].push(tile);
      }
    }
  }

  createOneTile(row, col) {
    let tileInfo = this.findRandomColorForTile();
    let tile = new Tile(tileInfo.file, row, col, tileInfo.index, 2, tileInfo.isSuperTile);
    return tile
  }

  createSuperTile(tile) {
    let superTile = new Tile(res.BOMB_IMAGE, tile.row, tile.col, 6, 2, true);
    this.tiles[tile.row][tile.col] = superTile;
    return superTile
  }
  //проверям находится ли клетка внутри игрового поля
  isWithinField(tail) {
    return tail.row >= 0 && tail.row < this.rows && tail.col >= 0 && tail.col < this.colls;
  }


  //проверяем окружение выбранной tile, затем проверям окружение клеток, которые окружают выбранную нами tile  и т.д пока окружение всех клеток не проверим
  findAllCommonTiles(tile, tilesForSuperTile) {
    let closestCommonTiles = this.findCommonColorTile(tile);
    if (closestCommonTiles.length > 0) {
      tile.isPicked = true;
      let commonTiles = [tile];
      while (closestCommonTiles.length > 0) {
        for (let i = 0; i < closestCommonTiles.length; i++) {
          closestCommonTiles[i].isPicked = true;
          let closestTilesForCheckedTile = this.findCommonColorTile(closestCommonTiles[i]);
          closestCommonTiles.push(...closestTilesForCheckedTile);
          commonTiles.push(...closestCommonTiles.splice(i, 1))
        }
      }
      if (commonTiles.length > tilesForSuperTile) {
        tile.isSuperTile = true;
      }
      return commonTiles
    }
  }


  //проверяме 4 направления выбранной tile
  findCommonColorTile(tile) {

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

  //сдвигаем клетки под которомы есть пустоты после удаления
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

  //находим рандомный цвет для ячейки
  findRandomColorForTile() {
    let tile;
    let randomNumber = Math.random();
    if (randomNumber > 0.98) {
      tile = { file: res.BOMB_IMAGE, index: 6, isSuperTile: true }
    } else {
      let tilesFiles = [
        { file: res.BTILE_IMAGE, index: 1, isSuperTile: false },
        { file: res.GTILE_IMAGE, index: 2, isSuperTile: false },
        { file: res.PTILE_IMAGE, index: 3, isSuperTile: false },
        { file: res.RTILE_IMAGE, index: 4, isSuperTile: false },
        { file: res.YTILE_IMAGE, index: 5, isSuperTile: false }];
      tile = tilesFiles[Math.floor(randomNumber * tilesFiles.length)];
    }
    return tile;
  }
}

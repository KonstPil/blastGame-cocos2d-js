class Field {
  constructor(rows, colls) {
    this.rows = rows;
    this.colls = colls;
    this.tiles = [];
    this.createTilesArray();
  }

  findTiles(pickedTileCoord) {
    if (this.isWithinField(pickedTileCoord)) {
      let pickedTile = this.tiles[pickedTileCoord.row][pickedTileCoord.col];
      let pickedArr = this.findAllCommonTiles(pickedTile)
      return pickedArr
    }
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
    let tileColor = this.findRandomColorForTile();
    let tile = new Tile(tileColor.file, row, col, tileColor.index, 2);
    return tile
  }
  //находим рандомный цвет для ячейки
  findRandomColorForTile() {
    let tilesFiles = [
      { file: res.BTILE_IMAGE, index: 1 },
      { file: res.GTILE_IMAGE, index: 2 },
      { file: res.PTILE_IMAGE, index: 3 },
      { file: res.RTILE_IMAGE, index: 4 },
      { file: res.YTILE_IMAGE, index: 5 }];
    let fileNameNumber = Math.floor(Math.random() * tilesFiles.length)
    return tilesFiles[fileNameNumber]
  }

  //проверям находится ли клетка внутри игрового поля
  isWithinField(tail) {
    return tail.row >= 0 && tail.row < this.rows && tail.col >= 0 && tail.col < this.colls;
  }


  //проверяем окружение выбранной tile, затем проверям окружение клеток, которые окружают выбранную нами tile  и т.д пока окружение всех клеток не проверим
  findAllCommonTiles(tile) {
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

}

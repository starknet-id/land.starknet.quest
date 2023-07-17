import {
  Tileset,
  iLDtk,
  Level,
  IntGridValue,
  EntityProps,
  Entity,
  TileRect,
} from "@/types/ldtk";
import * as THREE from "three";
import {
  CityBuilded,
  CityBuildings,
  CityLight,
  CityObjectsProps,
  CityProps,
  CitySize,
  SpriteBounds,
  TileData,
} from "@/types/types";
import {
  MAX_LAND_HEIGHT,
  MAX_LAND_WIDTH,
  MIN_LAND_HEIGHT,
  MIN_LAND_WIDTH,
  buildingsOrdered,
  TILE_EMPTY,
  propsOffset,
  pointLightsData,
  PropsTypes,
  PropsTypesNames,
  tileTypes,
} from "./constants";
import {
  calculateCityCenter,
  convertTo2D,
  findClosestCorner,
  getCustomDataArr,
  getOffsetFromDirection,
  getSubArray,
  needsDirectionChange,
  setDirectionBasedOnCorner,
  shuffleAndHandleCorners,
  shuffleArray,
} from "./landUtils";

export class LdtkReader {
  json: any;
  level!: Level;
  tilesets: Array<Tileset>;
  ldtk: iLDtk;
  address: string;
  city: Array<Array<number>>;
  cityBuilded: Array<Array<CityBuilded | null>>;
  buildings: Array<Array<CityBuildings | null>>;
  cityProps: Array<Array<CityProps | null>>;
  idxToRule: { [key: string]: number };
  citySize: number;
  TILE_LAND: number;
  TILE_ROAD: number;
  rectangles: Array<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }> = [];
  userNft: { [key: string]: boolean | number } | undefined;
  entities: { [key: string]: { [key: number]: EntityProps[] } };
  currentDirection: string | null = null;
  lights: CityLight[] = []; //ok
  blockedPaths: Array<{ x: number; y: number }> = []; // ok
  props: Array<Array<CityObjectsProps>> = [];
  tileData: Record<tileTypes, TileData[]>; // ok

  constructor(
    filejson: any,
    address: string,
    citySize: number,
    userNft?: { [key: string]: boolean | number }
  ) {
    this.json = filejson;
    this.tilesets = this.json.defs.tilesets;
    this.ldtk = filejson;
    this.address = address;
    this.citySize = citySize;
    this.city = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(TILE_EMPTY));
    this.buildings = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));
    this.cityBuilded = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));
    this.cityProps = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));

    const intGrid = this.ldtk.defs.layers.filter(
      (l: any) => l.__type === "IntGrid"
    )[0];
    const idxToRule = intGrid.intGridValues.map((val: IntGridValue) => {
      return { [val.identifier]: val.value };
    });
    this.idxToRule = Object.assign({}, ...idxToRule);
    this.TILE_LAND = this.idxToRule["Sidewalk"];
    this.TILE_ROAD = this.idxToRule["Roads"];

    this.entities = this.sortEntities(userNft);
    this.userNft = userNft;

    for (let propType in PropsTypes) {
      this.props[propType] = [];
    }
    this.tileData = {
      [tileTypes.PROPS]: [],
    };
    this.buildTileData();
  }

  buildTileData() {
    Object.values(PropsTypes).forEach((propType) => {
      const propTypeName = PropsTypesNames[propType as PropsTypes];
      const entity = this.entities["Props"][0].find(
        (elem) => elem.identifier === propTypeName
      );
      const tileset = this.tilesets.find(
        (t) => t.uid === entity?.tileRect.tilesetUid
      );
      if (!entity || !tileset) return;
      let spritesPerRow = tileset?.pxWid / tileset?.tileGridSize ?? 1;
      let spritesPerColumn = tileset?.pxHei / tileset?.tileGridSize ?? 1;
      let xIndex = entity?.tileRect.x / tileset?.tileGridSize ?? 0;
      let yIndex = entity?.tileRect.y / tileset?.tileGridSize ?? 0;
      let xOffset = xIndex / spritesPerRow;
      let yOffset =
        1 - (yIndex + (entity?.tileRect.h ?? 0) / 16) / spritesPerColumn;

      this.tileData[tileTypes.PROPS].push({
        entity,
        plane: {
          w: (entity?.tileRect.w ?? 0) / 16,
          h: (entity?.tileRect.h ?? 0) / 16,
        },
        textureOffset: { x: xOffset, y: yOffset },
        textureRepeat: {
          x:
            1 /
            (spritesPerRow /
              ((entity?.tileRect.w ?? 0) / tileset?.tileGridSize ?? 1)),
          y:
            1 /
            (spritesPerColumn /
              ((entity?.tileRect.h ?? 0) / tileset?.tileGridSize ?? 1)),
        },
        z: 0.23,
      });
    });
  }

  // TODO: filter depending on NFTs
  sortEntities(userNft?: { [key: string]: boolean | number }) {
    let entitiesSorted: { [key: string]: { [key: number]: EntityProps[] } } =
      {};
    this.ldtk.defs.entities.forEach((entity: Entity) => {
      let heightGroup = 0;
      let activeWidth = 0;
      let activeHeight = 0;
      let corner = "";
      let level = 0;
      let key = "";
      const splittedId = entity.identifier.split("_");

      if (splittedId[0] === "NFT") {
        key = "NFT";
        if (
          splittedId.length === 5 &&
          (splittedId[1].startsWith("BraavosMain") ||
            splittedId[1].startsWith("ArgentMain"))
        ) {
          activeWidth = parseInt(splittedId[2][0]);
          activeHeight = parseInt(splittedId[2][2]);
          heightGroup = parseInt(splittedId[3][1]);
          level = parseInt(splittedId[4][0]);
        } else if (
          splittedId.length === 5 &&
          splittedId[1].startsWith("ArgentExplorer")
        ) {
          // we have to do this until we fix the json file
          level = parseInt(splittedId[2][0]);
          heightGroup = parseInt(splittedId[4][1]);
          activeWidth = parseInt(splittedId[3][0]);
          activeHeight = parseInt(splittedId[3][2]);
        } else if (
          splittedId.length === 5 &&
          !splittedId[1].startsWith("BraavosMain") &&
          !splittedId[1].startsWith("ArgentMain") &&
          !splittedId[1].startsWith("ArgentExplorer")
        ) {
          // no levels but a corner
          corner = splittedId[4];
          heightGroup = parseInt(splittedId[3][1]);
          activeWidth = parseInt(splittedId[2][0]);
          activeHeight = parseInt(splittedId[2][2]);
        } else {
          heightGroup = parseInt(splittedId[3][1]);
          activeWidth = parseInt(splittedId[2][0]);
          activeHeight = parseInt(splittedId[2][2]);
        }
      } else if (splittedId[0] === "Generic") {
        key = "Generic";
        activeWidth = parseInt(splittedId[2][0]);
        activeHeight = parseInt(splittedId[2][2]);
        heightGroup = parseInt(splittedId[3][1]);
      } else if (splittedId[0] === "Building") {
        key = "Generic";
        activeWidth = parseInt(splittedId[1][0]);
        activeHeight = parseInt(splittedId[1][2]);
        heightGroup = parseInt(splittedId[2][1]);
      } else if (splittedId[0] === "Props") {
        key = "Props";
      }

      // Get custom data for entities
      let customData = null;
      let customDatas: { [key: string]: any }[] = [];
      let tileIdsArr: number[][] | null = null;
      const tileset = this.ldtk.defs.tilesets.find(
        (tileset: Tileset) => tileset.uid === entity.tileRect.tilesetUid
      );
      if (tileset) {
        const bounds = this.getTileIdsFromSprite(
          entity.tileRect,
          tileset.__cWid
        );
        tileIdsArr = this.getTileIdsArray(
          entity.tileRect,
          tileset.__cWid,
          bounds
        );
        // console.log("entity rect", entity.identifier, tileIdsArr);
        const flatArr = tileIdsArr.flat();
        const data = tileset.customData.filter(
          (data: { tileId: number; data: string }) =>
            flatArr.includes(data.tileId)
        );
        data.map((elem) => {
          customDatas[customDatas.length] = {
            tileId: elem.tileId,
            ...getCustomDataArr(elem.data),
          };
        });
      }

      const entityProps: EntityProps = {
        ...entity,
        activeWidth,
        activeHeight,
        heightGroup,
        isBuilt: false,
        corner,
        level,
        tileIdsArr,
        customDatas,
      };
      if (!entitiesSorted[key]) entitiesSorted[key] = {};
      if (!entitiesSorted[key][activeWidth]) {
        entitiesSorted[key][activeWidth] = [];
      }
      entitiesSorted[key][activeWidth].push(entityProps);
    });

    for (let entityType in entitiesSorted) {
      for (let activeWidth in entitiesSorted[entityType]) {
        entitiesSorted[entityType][activeWidth].sort(
          (a: EntityProps, b: EntityProps) => {
            // First sort by activeWidth in descending order
            if (a.activeWidth !== b.activeWidth) {
              return b.activeWidth - a.activeWidth;
            }
            // If activeWidth is the same, sort by activeHeight in descending order
            else {
              return b.activeHeight - a.activeHeight;
            }
          }
        );
      }
    }

    return entitiesSorted;
  }

  CreateMap(levelName: string, tileset: string | string[]): any {
    let j = this.ldtk;
    this.level = j.levels.find(
      (l: Level) => l.identifier === levelName
    ) as Level;

    if (!this.level) throw new Error("Level not found");

    let mappack: any = {};
    mappack.name = this.level.identifier;
    mappack.entityLayers = [];

    this.level.layerInstances.forEach((layer) => {
      let usedTileset;
      if (typeof tileset === "string") usedTileset = tileset;
      else
        usedTileset = tileset.find(
          (t) =>
            t ===
            this.tilesets
              .find((t2) => t2.uid === layer.__tilesetDefUid)
              ?.identifier.toLowerCase()
        );

      if (!usedTileset) {
        console.warn("No tileset found for layer " + layer.__identifier);
      }
    });

    this.level.layerInstances.forEach((layer) => {
      if (layer.__type === "Entities") {
        mappack.entityLayers?.push(layer);
      }
    });

    // Generate blocks & rules
    this.GenerateBlocks();
    this.addBoundariesAroundLand();
    this.ApplyRules();
    this.placeProps();

    return mappack;
  }

  GenerateBlocks(): void {
    let blockMax = 3;
    let blockNb = 0;

    while (blockNb <= blockMax) {
      this.GenerateBlock(blockNb);
      blockNb++;
    }
  }

  GenerateBlock(blockNb: number): void {
    let center: { x: number; y: number } | null;

    // generate a new block
    const blockSize = this.GetRandomBlockSize(blockNb);
    // console.log(
    //   "----- NEW BLOCK SIZE for rectangle",
    //   blockSize,
    //   "blockNb",
    //   blockNb
    // );

    if (blockNb == 0) {
      center = {
        x: Math.floor(this.citySize / 2),
        y: Math.floor(this.citySize / 2),
      };
      const corner = {
        x: center.x - Math.floor(blockSize.x / 2),
        y: center.y - Math.floor(blockSize.y / 2),
        direction: "bottom",
      };
      const coordinates = this.PlaceRectangle(corner, blockSize);
      if (!coordinates) return;
      this.addRoadsAroundLand();
      this.generateBuildings(blockSize, coordinates);
    } else {
      this.findNextBlockCorners(blockSize);
    }
    // console.log("city", this.city);
  }

  findValidRoadTiles(
    direction: string
  ): { x: number; y: number; direction: string }[] {
    let roadTiles = [];

    for (let y = 0; y < this.citySize; y++) {
      for (let x = 0; x < this.citySize; x++) {
        if (this.city[y][x] === this.TILE_ROAD) {
          const offsets = getOffsetFromDirection(direction);
          for (let offset of offsets) {
            // Check if the current offset is out of bounds
            if (
              y + offset.offsetY < 0 ||
              y + offset.offsetY >= this.citySize ||
              x + offset.offsetX < 0 ||
              x + offset.offsetX >= this.citySize
            ) {
              continue;
            }

            // Check if the tile at the current offset is empty
            if (this.city[y + offset.offsetY][x + offset.offsetX] === 0) {
              // Add the road tile to the list and break out of the offset loop
              roadTiles.push({ x, y, direction: offset.direction });
              break;
            }
          }
        }
      }
    }
    return roadTiles;
  }

  // randomly choose where to start the next block of buildings
  FindRandomRoadTile(
    rectangleSize: THREE.Vector2,
    direction: string,
    citySize: CitySize
  ): { x: number; y: number; direction: string; corner: string } | null {
    let roadTiles = this.findValidRoadTiles(direction);
    if (roadTiles.length === 0) {
      return null;
    }

    // if (direction === "random") {
    //   roadTiles.sort((a, b) => b.y - a.y);
    // } else if (direction === "top") {
    //   roadTiles.sort((a, b) => a.y - b.y);
    // }
    // if (direction === "top") {
    //   roadTiles.sort((a, b) => a.y - b.y || b.x - a.x);
    // } else if (direction === "bottom") {
    //   roadTiles.sort((a, b) => b.y - a.y || a.x - b.x);
    // } else if (direction === "right") {
    //   roadTiles.sort((a, b) => b.y - a.y || b.x - a.x);
    // } else if (direction === "left") {
    //   roadTiles.sort((a, b) => b.y - a.y || a.x - b.x);
    // }
    // console.log("possible roadTiles", roadTiles);

    let selectedRoadTile = false;
    let counter: number = 0; // keep track of first index
    while (!selectedRoadTile) {
      for (let roadTile of roadTiles) {
        let potentialTiles = [];
        if (direction === "right" && roadTile.y > citySize.minY) {
          potentialTiles.push({
            x: roadTile.x + 1,
            y: roadTile.y,
            direction: "right",
            corner: "bottomLeft",
          });
        } else if (direction === "left" && roadTile.y > citySize.minY) {
          potentialTiles.push({
            x: roadTile.x - 1,
            y: roadTile.y,
            direction: "left",
            corner: "topRight",
          });
        } else if (direction === "top" && roadTile.x < citySize.maxX) {
          potentialTiles.push({
            x: roadTile.x,
            y: roadTile.y - 1,
            direction: "top",
            corner: "bottomRight",
          });
        } else if (direction === "bottom" && roadTile.x > citySize.minX) {
          potentialTiles.push({
            x: roadTile.x,
            y: roadTile.y + 1,
            direction: "bottom",
            corner: "topLeft",
          });
        }
        // console.log("potentialTiles", potentialTiles);

        // Filter out tiles that are outside the grid or not empty
        let validTiles = potentialTiles.filter(
          (tile) =>
            tile.x >= 0 &&
            tile.x < this.citySize &&
            tile.y >= 0 &&
            tile.y < this.citySize &&
            this.city[tile.y][tile.x] === 0
        );
        // console.log("validTiles", validTiles);

        let validTile = null;
        if (validTiles.length > 0) {
          for (let tile of validTiles) {
            const isValid = this.CheckSpaceForRectangle(
              tile,
              rectangleSize,
              direction
            );
            if (isValid) {
              selectedRoadTile = true;
              // console.log("tile selected", tile);
              validTile = tile;
              break;
            }
          }
        }

        // console.log("selectedRoadTile", selectedRoadTile);

        if (selectedRoadTile) {
          return validTile;
        }

        counter++;
        if (counter === 1000) return null; // avoid inifinite loop
      }
    }
    return null;
  }

  findCitySize(): { minX: number; maxX: number; minY: number; maxY: number } {
    let minX = this.citySize,
      minY = this.citySize,
      maxX = -1,
      maxY = -1;

    for (let y = 0; y < this.citySize; y++) {
      for (let x = 0; x < this.citySize; x++) {
        // Check if the current tile is part of the rectangle (1 or 2)
        if (this.city[y][x] === 1 || this.city[y][x] === 2) {
          // Update the bounding coordinates
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    return { minX, maxX, minY, maxY };
  }

  findEmptyCorners(arr: number[][]) {
    let rows = arr.length;
    let cols = arr[0].length;
    let corners = [];

    for (let r = 1; r < rows - 1; r++) {
      for (let c = 1; c < cols - 1; c++) {
        if (arr[r][c] === 0) {
          if (arr[r - 1][c] > 0 && arr[r][c - 1] > 0) {
            // upper-left corner
            corners.push({
              row: r,
              col: c,
              corner: "topLeft",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r - 1][c] > 0 && arr[r][c + 1] > 0) {
            // upper-right corner
            corners.push({
              row: r,
              col: c,
              corner: "topRight",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r + 1][c] > 0 && arr[r][c - 1] > 0) {
            // lower-left corner
            corners.push({
              row: r,
              col: c,
              corner: "bottomLeft",
              w: cols - c,
              h: rows - r,
            });
          } else if (arr[r + 1][c] > 0 && arr[r][c + 1] > 0) {
            // lower-right corner
            corners.push({
              row: r,
              col: c,
              corner: "bottomRight",
              w: cols - c,
              h: rows - r,
            });
          }
        }
      }
    }
    return corners;
  }

  findNextBlockCorners(blockSize: THREE.Vector2) {
    // todo: choose randomly first direction instead
    if (!this.currentDirection) this.currentDirection = "top";

    const citySize = this.calculateCitySize();
    const center = calculateCityCenter(
      citySize.minX,
      citySize.maxX,
      citySize.minY,
      citySize.maxY
    );
    // console.log("this.currentDirection", this.currentDirection);

    const subArr = getSubArray(
      this.city,
      citySize.minX,
      citySize.maxX,
      citySize.minY,
      citySize.maxY
    );
    // console.log("subArr", subArr);
    const corners = this.findEmptyCorners(subArr);
    // console.log("corners", corners);
    let closestCorner = findClosestCorner(center, corners);
    // console.log("closestCorner", closestCorner);

    if (
      !closestCorner ||
      needsDirectionChange(closestCorner, subArr, blockSize)
    ) {
      // console.log("need change dir", this.currentDirection);
      // console.log("citySize", citySize);
      this.changeDirection(citySize);
      // console.log("new direction", this.currentDirection);
      let roadTile = this.FindRandomRoadTile(
        blockSize,
        this.currentDirection,
        citySize
      );
      // console.log("roadTile 1", roadTile);
      if (roadTile) {
        const coordinates = this.PlaceRectangle(
          { x: roadTile.x, y: roadTile.y, direction: roadTile.corner },
          blockSize
        );
        this.generateBuildings(blockSize, coordinates as any);
        this.addRoadsAroundLand();
      }
    } else {
      const coordinates = this.PlaceRectangle(
        {
          x: closestCorner.col + citySize.minX,
          y: closestCorner.row + citySize.minY,
          direction: closestCorner.corner,
        },
        blockSize
      );
      this.addRoadsAroundLand();
      this.generateBuildings(blockSize, coordinates as any);
      this.currentDirection = setDirectionBasedOnCorner(closestCorner);
    }
  }

  calculateCitySize(): CitySize {
    const { minX, maxX, minY, maxY } = this.findCitySize();
    const citySizeX = maxX - minX + 1;
    const citySizeY = maxY - minY + 1;

    return { minX, maxX, minY, maxY, citySizeX, citySizeY };
  }

  changeDirection(citySize: { citySizeX: number; citySizeY: number }) {
    if (
      citySize.citySizeX >= citySize.citySizeY &&
      this.currentDirection !== "top" &&
      this.currentDirection !== "bottom"
    ) {
      this.currentDirection =
        this.currentDirection === "left" ? "bottom" : "top";
    } else if (
      citySize.citySizeX <= citySize.citySizeY &&
      this.currentDirection !== "right" &&
      this.currentDirection !== "left"
    ) {
      this.currentDirection =
        this.currentDirection === "top" ? "left" : "right";
    }
  }

  PlaceRectangle(
    corner: { x: number; y: number; direction: string },
    rectangleSize: THREE.Vector2
  ): { startX: number; startY: number; endX: number; endY: number } | null {
    let startX, startY, endX, endY;

    if (corner.direction === "topLeft") {
      // If the space is below, the corner is the top-left of the rectangle
      startX = corner.x;
      startY = corner.y;
      endX = corner.x + rectangleSize.x;
      endY = corner.y + rectangleSize.y;
    } else if (corner.direction === "topRight") {
      // corner is the top right of the rectangle
      startX = corner.x - rectangleSize.x + 1;
      startY = corner.y;
      endX = corner.x + 1;
      endY = corner.y + rectangleSize.y + 1;
    } else if (corner.direction === "bottomRight") {
      // the corner is the bottom-right of the rectangle
      startX = corner.x - rectangleSize.x + 1;
      startY = corner.y - rectangleSize.y + 1;
      endX = corner.x + 1;
      endY = corner.y + 1;
    } else {
      // For all other cases, the corner is the bottom-left of the rectangle
      startX = corner.x;
      startY = corner.y - rectangleSize.y + 1;
      endX = corner.x + rectangleSize.x;
      endY = corner.y + 1;
    }

    // Ensure the rectangle is within the city bounds
    if (
      startX < 0 ||
      startY < 0 ||
      endX > this.citySize ||
      endY > this.citySize
    ) {
      return null;
    }
    // Fill in the rectangle
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.city[y][x] = this.TILE_LAND;
      }
    }
    return { startX, startY, endX, endY };
  }

  addRoadsAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.city));

    for (let y = 0; y < this.city.length; y++) {
      for (let x = 0; x < this.city[y].length; x++) {
        // Check if the current cell is a land
        if (this.city[y][x] === this.idxToRule["Sidewalk"]) {
          // Go through the cells in a 2-unit radius around the current cell
          for (let yOffset = -2; yOffset <= 2; yOffset++) {
            for (let xOffset = -2; xOffset <= 2; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.city.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.city[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as a road
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Roads"];
                }
              }
            }
          }
        }
      }
    }
    this.city = copyCityGrid;
    // console.log("this.city after roads", this.city);
  }

  addBoundariesAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.city));

    for (let y = 0; y < this.city.length; y++) {
      for (let x = 0; x < this.city[y].length; x++) {
        // Check if the current cell is a land
        if (this.city[y][x] === this.idxToRule["Roads"]) {
          // Go through the cells in a 2-unit radius around the current cell
          for (let yOffset = -2; yOffset <= 2; yOffset++) {
            for (let xOffset = -2; xOffset <= 2; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.city.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.city[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as a road
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Boundaries"];
                }
              }
            }
          }
        }
      }
    }

    for (let y = 0; y < this.city.length; y++) {
      for (let x = 0; x < this.city[y].length; x++) {
        // Check if the current cell is a Boundary
        if (copyCityGrid[y][x] === this.idxToRule["Boundaries"]) {
          // Go through the cells in a 1-unit radius around the current cell
          for (let yOffset = -1; yOffset <= 1; yOffset++) {
            for (let xOffset = -1; xOffset <= 1; xOffset++) {
              // Check if the target cell is within the city grid
              if (
                y + yOffset >= 0 &&
                y + yOffset < this.city.length &&
                x + xOffset >= 0 &&
                x + xOffset < this.city[y].length
              ) {
                // Check if the target cell is empty
                if (copyCityGrid[y + yOffset][x + xOffset] === 0) {
                  // Mark the target cell as Exterior
                  copyCityGrid[y + yOffset][x + xOffset] =
                    this.idxToRule["Exterior"];
                }
              }
            }
          }
        }
      }
    }
    this.city = copyCityGrid;
    // console.log("this.city after grass", this.city);
    // console.log("ldtk", this.ldtk);
    // console.log("this.idxToRule", this.idxToRule);
  }

  CheckSpaceForRectangle(
    corner: any,
    rectangleSize: THREE.Vector2,
    direction: string
  ): boolean {
    // console.log("CORNER", corner);
    // Define increments for each direction
    let increments: { [key: string]: { x: number; y: number } } = {
      top: { x: 0, y: -1 },
      bottom: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };
    let increment = increments[direction];
    // Calculate the end points based on the direction
    let endX = corner.x + increment.x * rectangleSize.x;
    let endY = corner.y + increment.y * rectangleSize.y;

    // console.log("endX", endX, "endY", endY, "corner", corner);

    // Check if the rectangle would go out of bounds
    if (
      endX < 0 ||
      endX >= this.citySize ||
      endY < 0 ||
      endY >= this.citySize
    ) {
      // console.log("BORDER reached");
      return false;
    }

    // Check if the area required for the rectangle is empty
    for (let y = corner.y; y !== endY; y += increment.y) {
      for (let x = corner.x; x !== endX; x += increment.x) {
        // console.log("(y, x)", y, x);
        // If the current tile is not empty (0), return false
        if (this.city[y][x] !== 0) {
          return false;
        }
      }
    }

    // Check corner type
    let cornerType = "";
    if (corner.x < this.citySize / 2 && corner.y < this.citySize / 2) {
      cornerType = "TopLeft";
    } else if (corner.x >= this.citySize / 2 && corner.y < this.citySize / 2) {
      cornerType = "TopRight";
    } else if (corner.x < this.citySize / 2 && corner.y >= this.citySize / 2) {
      cornerType = "BottomLeft";
    } else {
      cornerType = "BottomRight";
    }
    // console.log("cornerType", cornerType);
    return true;
  }

  // Get the size of a new block of buildings
  GetRandomBlockSize(blockNb: number): THREE.Vector2 {
    let rand = this.randomGround(blockNb * 10);
    let width = Math.round(
      MIN_LAND_WIDTH + rand * (MAX_LAND_WIDTH - MIN_LAND_WIDTH)
    );

    rand = this.randomGround(blockNb * 100);
    let height = Math.round(
      MIN_LAND_HEIGHT + rand * (MAX_LAND_HEIGHT - MIN_LAND_HEIGHT)
    );

    return new THREE.Vector2(width, height);
  }

  // Applying rules on each ground tile type
  ApplyRules(): void {
    // todo: replace with find layers with identifier IntGrid
    let rules = this.ldtk.defs.layers[1];

    // parse rulegroups to build grounds
    for (let l = 0; l < rules.autoRuleGroups.length; l++) {
      let roadGroup = rules.autoRuleGroups[l];

      // only check active groups
      if (roadGroup.active) {
        let idx = this.idxToRule[roadGroup.name as string]; // get IntGrid value from rule group name
        if (idx) {
          for (let y = 0; y < this.city.length; y++) {
            for (let x = 0; x < this.city[y].length; x++) {
              // check which king of ground we have at this position
              if (this.city[y][x] === idx) {
                // check each rules
                for (let r = 0; r < roadGroup.rules.length; r++) {
                  const rule = roadGroup.rules[r];
                  const pattern2D = convertTo2D(rule.pattern, rule.size);

                  const { match, needFlipX, needFlipY } = this.MatchesPattern(
                    this.city,
                    pattern2D,
                    x,
                    y,
                    idx,
                    Math.floor(pattern2D.length / 2),
                    rule.flipX,
                    rule.flipY
                  );
                  if (match) {
                    const rand = Math.random();

                    if (
                      rule.chance === 1 ||
                      (rule.chance !== 1 && rand < rule.chance)
                    ) {
                      this.cityBuilded[y][x] = {
                        tileId:
                          rule.tileIds.length > 0
                            ? rule.tileIds[
                                Math.floor(Math.random() * rule.tileIds.length)
                              ]
                            : rule.tileIds[0],
                        flipX: needFlipX,
                        flipY: needFlipY,
                      };

                      if (rule.breakOnMatch) break;
                    } else {
                      continue;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  MatchesPattern(
    mapData: Array<Array<number>>,
    pattern: Array<Array<number>>,
    x: number,
    y: number,
    ruleNb: number,
    offset: number,
    checkFlipX: boolean,
    checkFlipY: boolean
  ): { match: boolean; needFlipX: boolean; needFlipY: boolean } {
    const checkPattern = (flipX: boolean, flipY: boolean) => {
      for (let py = 0; py < pattern.length; py++) {
        for (let px = 0; px < pattern[py].length; px++) {
          let currentPx = flipX ? pattern[py].length - px - 1 : px;
          let currentPy = flipY ? pattern.length - py - 1 : py;

          // If the pattern element is 0, it's a wildcard, so it always matches
          if (pattern[currentPy][currentPx] === 0) continue;

          if (
            y + py < this.citySize &&
            x + px < this.citySize &&
            y - py >= 0 &&
            x - px >= 0 &&
            x - offset + px >= 0 &&
            y - offset + py >= 0
          ) {
            // If the pattern element is -ruleNb, it matches anything that is not ruleNb
            if (
              pattern[currentPy][currentPx] === -ruleNb &&
              mapData[y - offset + py][x - offset + px] !== ruleNb
            )
              continue;

            // If the pattern element is a positive integer, it must match exactly
            if (
              mapData[y - offset + py][x - offset + px] !==
              pattern[currentPy][currentPx]
            ) {
              return false;
            }
          } else {
            return false;
          }
        }
      }

      return true;
    };

    // First check without flipping
    if (checkPattern(false, false)) {
      return { match: true, needFlipX: false, needFlipY: false };
    }
    if (checkFlipX && checkPattern(true, false)) {
      return { match: true, needFlipX: true, needFlipY: false };
    }
    if (checkFlipY && checkPattern(false, true)) {
      return { match: true, needFlipX: false, needFlipY: true };
    }
    if (checkFlipX && checkFlipY && checkPattern(true, true)) {
      return { match: true, needFlipX: true, needFlipY: true };
    }

    return { match: false, needFlipX: false, needFlipY: false };
  }

  generateBuildings(
    // corner: { x: number; y: number; direction: string },
    rectangleSize: THREE.Vector2,
    coordinates: { startX: number; startY: number; endX: number; endY: number }
  ): void {
    // console.log("entitiesSorted", this.entities);
    // @ts-ignore
    let possibleCombinations = buildingsOrdered[rectangleSize.x - 2]; // substract sidewalk width
    // console.log("possibleCombinations", possibleCombinations);

    // start at a random index
    const rand = this.randomGround(rectangleSize.x + rectangleSize.y);
    let indexStart = Math.floor(rand * possibleCombinations.length);

    const copyEntities = JSON.parse(JSON.stringify(this.entities));

    let counter = 0;
    while (counter < possibleCombinations.length) {
      let toBuild: EntityProps[] = [];
      let nftCounter = rectangleSize.x < 9 ? 2 : rectangleSize.x < 12 ? 3 : 4;
      // console.log("testing a new NFT combination", nftCounter);

      const combination = possibleCombinations[indexStart];
      // console.log("combination", combination);

      let isBuilt = true;
      let x = coordinates.startX + 1; // add sidewalk
      let y = coordinates.endY - 1 - 1; // substract sidewalk

      for (let i = 0; i < combination.length; i++) {
        // console.log("combination[i]", combination[i]);

        // Depending on leftNFts, we choose between NFT or Generic
        const leftNfts =
          copyEntities["NFT"][combination[i]] &&
          copyEntities["NFT"][combination[i]].filter(
            (elem: EntityProps) => !elem.isBuilt
          );
        // console.log("leftNfts", leftNfts);
        const entityType =
          nftCounter > 0 && leftNfts && leftNfts.length > 0 ? "NFT" : "Generic";
        // console.log("entityType", entityType);

        if (
          entityType === "Generic" &&
          !copyEntities["Generic"][combination[i]]
        ) {
          isBuilt = false;
          break;
        }
        // Check if an entity with 'CornerLeft' or 'CornerRight' already exists in the 'toBuild' array
        const hasCornerLeft = toBuild.some(
          (entity: EntityProps) => entity.corner === "CornerLeft"
        );
        const hasCornerRight = toBuild.some(
          (entity: EntityProps) => entity.corner === "CornerRight"
        );

        copyEntities[entityType][combination[i]].sort(
          (a: EntityProps, b: EntityProps) => {
            if (entityType === "Generic") {
              if (
                a.tileRect.h / 16 === rectangleSize.y &&
                b.tileRect.h / 16 !== rectangleSize.y
              ) {
                return -1;
              } else if (
                b.tileRect.h / 16 === rectangleSize.y &&
                a.tileRect.h / 16 !== rectangleSize.y
              ) {
                return 1;
              }
            }
            return b.tileRect.h / 16 - a.tileRect.h / 16;
          }
        );

        // Find next NFT Index from left buildings
        const entityIndex = copyEntities[entityType][combination[i]].findIndex(
          (elem: EntityProps) =>
            !elem.isBuilt &&
            ((hasCornerLeft && elem.corner !== "CornerLeft") ||
              (hasCornerRight && elem.corner !== "CornerRight") ||
              (!hasCornerLeft && !hasCornerRight))
        );
        if (entityIndex !== -1) {
          // if entity is found, we keep it
          const entity = copyEntities[entityType][combination[i]][entityIndex];
          toBuild.push(entity);
          copyEntities[entityType][combination[i]][entityIndex].isBuilt = true;
          if (entityType === "NFT") nftCounter--;
        } else {
          // console.log(
          //   "not enough NFTs to build this combination, let's try the next one"
          // );
          isBuilt = false;
          break;
        }
      }

      if (isBuilt) {
        this.entities = copyEntities;
        const shuffledBuildings = shuffleAndHandleCorners(toBuild, rand);
        // todo: when building (in case we're au-dessus a sidewalk), we check we can place props (no = -1)
        this.build(shuffledBuildings, x, y, true);
        this.fillRemainingSpace(rectangleSize, x, y);
        break;
      }
      if (indexStart === possibleCombinations.length - 1) indexStart = 0;
      counter++;
      indexStart++;
    }
    // print subArray of buildings
    // const { minX, maxX, minY, maxY } = this.findCitySize();
    // printSubArray(this.buildings, minX, maxX, minY, maxY);
  }

  build(
    entities: EntityProps[],
    x: number,
    y: number,
    isFirstLine: boolean
  ): void {
    entities.forEach((entity: EntityProps) => {
      const xOffset = entity.corner === "CornerLeft" ? x - 1 : x;
      for (
        let w = 0;
        w < (entity.corner ? entity.activeWidth + 1 : entity.activeWidth);
        w++
      ) {
        for (let h = 0; h < entity?.tileRect.h / 16; h++) {
          if (w === 0 && h === 0) {
            this.buildings[y][xOffset] = {
              tile: entity.tileRect,
              isOccupied: true,
              isHidden: false,
            };
          } else {
            this.buildings[y - h][xOffset + w] = {
              tile: null,
              isOccupied: false,
              isHidden: true,
            };
          }
        }
      }
      if (isFirstLine && entity.fieldDefs && entity.fieldDefs.length > 0) {
        const blockedTiles = entity.fieldDefs[0].defaultOverride?.params[0]
          .toString()
          .split("-");
        blockedTiles &&
          blockedTiles.map((tile) => {
            this.blockedPaths.push({ x: x + parseInt(tile) - 1, y: y + 1 });
          });
      }

      x = x + entity.activeWidth;
      if (entity.customDatas) {
        this.addLight(
          entity.tileIdsArr,
          entity.customDatas,
          { x: 0, y: 0 },
          xOffset,
          y
        );
      }
    });
    // console.log("this.lights", this.lights);
  }

  fillRemainingSpace(rectangleSize: THREE.Vector2, x: number, y: number): void {
    const innerWidth = rectangleSize.x - 2;
    const innerHeight = rectangleSize.y - 2;
    // console.log("innerHeight", innerHeight, "innerWidth", innerWidth);

    for (let i = y; i > y - innerHeight - 1; i--) {
      for (let j = x; j < x + innerWidth; j++) {
        const remainingWidth = x + innerWidth - j;
        if (!this.buildings[i][j]) {
          const counter = this.findCounter(i, j, x + innerWidth);
          const entityIndex = this.findEntityIndex(
            counter,
            innerHeight + 1,
            remainingWidth
          );
          if (entityIndex !== -1) {
            // console.log("counter", counter);
            const entity = this.entities["Generic"][counter][entityIndex];
            const activeHeight = entity.activeHeight;
            this.build([entity], j, i + activeHeight, false);
          }
        }
      }
    }
  }

  findCounter(i: number, j: number, limit: number): number {
    let counter = 0;
    while (
      (!this.buildings[i][j + counter] ||
        !this.buildings[i][j + counter]?.isOccupied) &&
      j + counter < limit
    ) {
      counter++;
      if (counter === 100) break; // todo: remove this as it's for debugging
    }
    if (counter > 5) {
      // @ts-ignore
      const possibleCombinations = buildingsOrdered[counter].filter(
        (combination: number[]) => !combination.includes(6)
      );
      counter = possibleCombinations[0][0];
    }
    return counter;
  }

  findEntityIndex(
    counter: number,
    innerHeight: number,
    remainingWidth: number
  ): number {
    let entityIndex = -1;
    while (entityIndex === -1) {
      entityIndex = this.getRandomBuilding(counter, innerHeight + 1);
      if (entityIndex === -1) counter++;
      if (counter === remainingWidth || counter === 100) break;
    }
    return entityIndex;
  }

  getRandomBuilding(width: number, maxHeight: number): number {
    const copyEntities = JSON.parse(JSON.stringify(this.entities));
    if (!copyEntities["Generic"][width]) return -1;
    const entityIndex = copyEntities["Generic"][width].findIndex(
      (elem: EntityProps) => !elem.isBuilt && elem.tileRect.h / 16 <= maxHeight
    );
    if (entityIndex === -1) return -1;
    console.log(' copyEntities["Generic"]', copyEntities["Generic"]);
    console.log("width", width, "entityIndex", entityIndex);
    copyEntities["Generic"][width][entityIndex].isBuilt = true;
    this.entities = copyEntities;
    return entityIndex;
  }

  placeProps(): void {
    const tileset = this.ldtk.defs.tilesets[0];
    const corners = tileset.customData;
    let propTypesArray = Object.values(PropsTypes).filter(
      (value) => typeof value === "number"
    ) as PropsTypes[];
    let propIndex = 1;

    for (let i = 0; i < this.city.length; i++) {
      for (let j = 0; j < this.city[i].length; j++) {
        if (this.city[i][j] !== 1) continue; // if not a sidewalk continue
        if (this.blockedPaths.find((elem) => elem.x === j && elem.y === i))
          continue; // if blocked sidewalk continue

        const tile = this.cityBuilded[i][j];
        const isCorner = this.checkWhichCorner(i, j);
        const isSide = this.checkWhichSidewalkSide(i, j);
        if (
          corners.find(
            (corner: { tileId: number; data: string }) =>
              corner.tileId === tile?.tileId
          ) &&
          isCorner
        ) {
          const entity = this.entities["Props"][0].find(
            (elem) => elem.identifier === "Props_StreetLight"
          );
          if (!entity) continue;
          this.cityProps[i][j] = {
            entityType: PropsTypes.LIGHT,
            corner: isCorner,
            z: 0,
          };
          const offset = propsOffset[entity.identifier][isCorner];
          this.props[PropsTypes.LIGHT].push({
            corner: isCorner,
            posX: j + entity.tileRect.h / 32 - 1,
            posY: i - entity.tileRect.w / 32 - 1,
            offset, // offset of props
          });
          if (entity.customDatas) {
            this.addLight(
              entity.tileIdsArr,
              entity.customDatas,
              propsOffset[entity.identifier][isCorner],
              j,
              i
            );
          }
        } else if (isSide) {
          const hashed = this.hash(this.address);
          let rand = this.createSeededRandom(hashed + i * j);
          let propType: PropsTypes | null = null;
          if (isSide === "bottom") {
            propType = propTypesArray[propIndex];
            if (propIndex === 4) propIndex = 1;
            else propIndex++;
          } else {
            if (rand < 0.3) {
              if (propIndex === 4) propIndex = 1;
              propType = propTypesArray[propIndex];
              propIndex++;
            }
          }

          if (propType) {
            const entity = this.entities["Props"][0].find(
              // @ts-ignore
              (elem) => elem.identifier === PropsTypesNames[propType]
            );
            if (!entity) continue;
            const offset = propsOffset[entity.identifier][isSide] ?? {
              x: 0,
              y: 0,
              z: 0,
            };
            this.props[propType].push({
              posX: j,
              posY: i - 1,
              side: isSide,
              offset, // offset of props
            });
            this.cityProps[i][j] = {
              entityType: propType,
              corner: isSide,
              z: isSide === "bottom" ? 0.01 : 0,
            };
          }
        }
      }
    }
  }

  checkWhichCorner(y: number, x: number): string | null {
    if (this.city[y][x - 1] === 2 && this.city[y - 1][x] === 2) {
      return "topLeft";
    } else if (this.city[y][x + 1] === 2 && this.city[y - 1][x] === 2) {
      return "topRight";
    } else if (this.city[y][x - 1] === 2 && this.city[y + 1][x] === 2) {
      return "bottomLeft";
    } else if (this.city[y][x + 1] === 2 && this.city[y + 1][x] === 2) {
      return "bottomRight";
    }
    return null;
  }

  checkWhichSidewalkSide(y: number, x: number): string | null {
    if (this.city[y][x - 1] === 2 && this.city[y][x + 1] === 1) {
      return "left";
    } else if (this.city[y][x + 1] === 2 && this.city[y][x - 1] === 1) {
      return "right";
    } else if (this.city[y - 1][x] === 2 && this.city[y + 1][x] === 1) {
      return "top";
    } else if (this.city[y + 1][x] === 2 && this.city[y - 1][x] === 1) {
      return "bottom";
    }
    return null;
  }

  getTileIdsFromSprite(tileRect: TileRect, cWid: number): SpriteBounds {
    const { x, y, h, w } = tileRect;
    let spriteTileIdTopLeft = (y / 16) * cWid + x / 16; // This is your `spriteTileIdStart`
    let spriteTileIdTopRight = spriteTileIdTopLeft + w / 16 - 1;
    let spriteTileIdBottomLeft = spriteTileIdTopLeft + (h / 16 - 1) * cWid;
    let spriteTileIdBottomRight = spriteTileIdBottomLeft + w / 16 - 1; // This is your `spriteTileIdEnd`
    return {
      spriteTileIdTopLeft,
      spriteTileIdTopRight,
      spriteTileIdBottomLeft,
      spriteTileIdBottomRight,
    };
  }

  getTileIdsArray(
    tileRect: TileRect,
    cWid: number,
    bounds: SpriteBounds
  ): number[][] {
    const { spriteTileIdTopLeft } = bounds;
    const tileIds: number[][] = [];
    let start = bounds.spriteTileIdTopLeft;
    for (let by = 0; by < tileRect.h / 16; by++) {
      for (let bx = 0; bx < tileRect.w / 16; bx++) {
        if (!tileIds[by]) tileIds[by] = [];
        tileIds[by][bx] = start;
        start++;
      }
      if (start > spriteTileIdTopLeft + tileRect.w / 16 - 1) {
        start = spriteTileIdTopLeft + cWid * (by + 1);
      }
    }
    return tileIds;
  }

  addLight(
    tileIdsArr: number[][] | null,
    customDatas: { [key: string]: any }[],
    offset: { x: number; y: number },
    x: number,
    y: number
  ) {
    // console.log("tileIdsArr", tileIdsArr);
    // console.log("customDatas", customDatas);
    const lights = customDatas.filter((elem) => elem.pointlight);
    // console.log("offset before", offset, lights);
    lights?.map((light) => {
      let tempOffset = offset;
      // console.log("placing light", light);
      // console.log("offset before", tempOffset);
      const lightType = light.pointlight;
      const lightProps = light ? pointLightsData[lightType] : null;
      if (tempOffset.x === 0 && tempOffset.y === 0 && tileIdsArr) {
        tempOffset = this.findTileIn2DArray(light.tileId, tileIdsArr);
        // console.log("NEW offset", tempOffset);
        if (light.offset) {
          if (light.offset.x === 0) tempOffset.x -= 0.5;
          if (light.offset.x === 1) tempOffset.x += 0.5;
          if (light.offset.y === 0) tempOffset.y += 0.5;
          if (light.offset.y === 1) tempOffset.y -= 0.5;
        }
      }
      // todo: add z in lights array
      this.lights.push({
        x,
        y,
        offset: tempOffset,
        posX: x + tempOffset.x + 0.5,
        posY: y + tempOffset.y - 0.5,
        type: lightType,
        props: lightProps,
      });
    });
  }

  // getBlockedPath(shuffledBuildings: EntityProps[], x: number, y: number) {
  //   shuffledBuildings.map((building) => {
  //     if (building.fieldDefs && building.fieldDefs.length > 0) {
  //       const blockedTiles = building.fieldDefs[0].defaultOverride?.params[0]
  //         .toString()
  //         .split("-");
  //       blockedTiles &&
  //         blockedTiles.map((tile) => {
  //           this.blockedPaths.push({ x: x + parseInt(tile), y: y + 1 });
  //         });
  //     }
  //     x = x + building.activeWidth;
  //   });
  // }

  findTileIn2DArray(tileId: number, arr: number[][]): { x: number; y: number } {
    for (let y = 0; y < arr.length; y++) {
      for (let x = 0; x < arr[y].length; x++) {
        if (arr[y][x] === tileId) {
          return { x, y: -(arr.length - 1 - y) };
        }
      }
    }
    return { x: 0, y: 0 };
  }

  randomGround(spec: number): number {
    const x = Math.sin(this.seedFromWallet(this.address) + spec) * 10000;
    return x - Math.floor(x);
  }

  seedFromWallet(wallet: string): number {
    let i: number = 3;
    let seed: number = 0;
    let seedStr: string = "";

    while (i < 20) {
      seedStr = seedStr + wallet[i].charCodeAt(0).toString();
      i = i + 3;
    }

    seed = parseInt(seedStr);
    return seed;
  }

  createSeededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  hash(s: string) {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (Math.imul(31, hash) + s.charCodeAt(i)) | 0;
    }
    return hash;
  }
}

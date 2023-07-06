import { Tileset, iLDtk, Level, IntGridValue } from "@/types/ldtk";
import * as THREE from "three";
import { CityBuilded } from "@/types/types";
import {
  MAX_LAND_HEIGHT,
  MAX_LAND_WIDTH,
  MIN_LAND_HEIGHT,
  MIN_LAND_WIDTH,
} from "./constants";
import {
  convertTo2D,
  findRectangleCorners,
  getOffsetFromDirection,
} from "./landUtils";

const TILE_EMPTY = 0;
const TILE_GRASS = 5;
const TILE_WATER = 3;

export class LdtkReader {
  json: any;
  level!: Level;
  tilesets: Array<Tileset>;
  ldtk: iLDtk;
  address: string;
  city: Array<Array<number>>;
  cityBuilded: Array<Array<CityBuilded | null>>;
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

  constructor(filejson: any, address: string, citySize: number) {
    this.json = filejson;
    this.tilesets = this.json.defs.tilesets;
    this.ldtk = filejson;
    this.address = address;
    this.citySize = citySize;
    this.city = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(TILE_EMPTY));
    this.cityBuilded = new Array(citySize)
      .fill(0)
      .map(() => new Array(citySize).fill(null));

    const intGrid = this.ldtk.defs.layers.filter(
      (l: any) => l.__type === "IntGrid"
    )[0];
    const idxToRule = intGrid.intGridValues.map((val: IntGridValue) => {
      return { [val.identifier]: val.value };
    });
    this.idxToRule = Object.assign({}, ...idxToRule);
    console.log("idxToRule", this.idxToRule);
    this.TILE_LAND = this.idxToRule["Sidewalk"];
    this.TILE_ROAD = this.idxToRule["Roads"];
  }

  // todo: typing of return value
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
    // this.addGrassAroundLand();
    this.ApplyRules();

    return mappack;
  }

  GenerateBlocks(): void {
    let blockMax = 5;
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
    console.log("----- NEW BLOCK SIZE for rectangle", blockSize);

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
      this.PlaceRectangle(corner, blockSize);
      this.addRoadsAroundLand();
    } else {
      center = this.findNextBlockCenter(blockNb, blockSize);
      if (!center) {
        console.log("No space left for a new block.");
        return;
      }
    }
  }

  // randomly choose where to start the next block of buildings
  FindRandomRoadTile(
    rectangleSize: THREE.Vector2,
    direction: string
  ): { x: number; y: number; direction: string } | null {
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

    if (roadTiles.length === 0) {
      return null;
    }

    if (direction === "random") {
      roadTiles.sort((a, b) => b.y - a.y);
    } else if (direction === "top") {
      roadTiles.sort((a, b) => a.y - b.y);
    }

    let selectedRoadTile = false;
    let counter: number = 0; // keep track of first index
    while (!selectedRoadTile) {
      for (let roadTile of roadTiles) {
        let potentialTiles = [
          {
            x: roadTile.x + 1,
            y: roadTile.y,
            direction: "right",
          }, // East
          {
            x: roadTile.x - 1,
            y: roadTile.y,
            direction: "left",
          }, // West
          {
            x: roadTile.x,
            y: roadTile.y + 1,
            direction: "bottom",
          }, // North
          {
            x: roadTile.x,
            y: roadTile.y - 1,
            direction: "top",
          }, // South
        ];

        // Filter out tiles that are outside the grid or not empty
        let validTiles = potentialTiles.filter(
          (tile) =>
            tile.x >= 0 &&
            tile.x < this.citySize &&
            tile.y >= 0 &&
            tile.y < this.citySize &&
            this.city[tile.y][tile.x] === 0
        );

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
              validTile = tile;
              break;
            }
          }
        }

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
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }
    }
    return { minX, maxX, minY, maxY };
  }

  findBiggestEmptyRect(minX: number, maxX: number, minY: number, maxY: number) {
    let maxArea = 0;
    let dp = new Array(this.city.length);
    for (let i = 0; i < this.city.length; i++) {
      dp[i] = new Array(this.city.length).fill(0);
    }

    // Traverse the grid within the specified bounds
    for (let i = minY; i <= maxY; i++) {
      for (let j = minX; j <= maxX; j++) {
        if (this.city[i][j] === 0) {
          // if the cell is empty
          if (i > minY && j > minX) {
            // if not on the upper or left bound
            let minDp = Math.min(dp[i][j - 1], dp[i - 1][j], dp[i - 1][j - 1]);
            dp[i][j] = minDp + 1;
          } else {
            dp[i][j] = 1;
          }
          maxArea = Math.max(maxArea, dp[i][j]);
        }
      }
    }

    for (let i = minY; i <= maxY; i++) {
      for (let j = minX; j <= maxX; j++) {
        if (dp[i][j] === maxArea) {
          let corners = findRectangleCorners(dp, j, i);
          return {
            maxArea,
            topLeft: corners.topLeft,
            topRight: { x: corners.bottomRight.x, y: corners.topLeft.y },
            bottomRight: corners.bottomRight,
            bottomLeft: { x: corners.topLeft.x, y: corners.bottomRight.y },
          };
        }
      }
    }
    return null;
  }

  findNextBlockCenter(
    blockNb: number,
    blockSize: THREE.Vector2
  ): { x: number; y: number } | null {
    const rand = this.randomGround(this.city.length);
    let direction =
      rand > 0.2 && rand < 0.4
        ? "bottom"
        : rand > 0.4 && rand < 0.6
        ? "top"
        : rand > 0.6 && rand < 0.8
        ? "right"
        : "left";
    if (blockNb >= 2) {
      // choose direction depending on city proportions
      const { minX, maxX, minY, maxY } = this.findCitySize();
      const citySizeX = maxX - minX + 1;
      const citySizeY = maxY - minY + 1;
      const corners = this.findBiggestEmptyRect(minX, maxX, minY, maxY);
      if (!corners) {
        console.log("NO CORNERS");
        return null;
      }
      if (corners.maxArea >= 2) {
        let corner = { x: 0, y: 0, direction: "" };
        // Check which corner is surrounded by roads
        if (
          this.city[corners.topLeft.y - 1][corners.topLeft.x] ==
            this.TILE_ROAD &&
          this.city[corners.topLeft.y][corners.topLeft.x - 1] == this.TILE_ROAD
        ) {
          corner = { ...corners.topLeft, direction: "bottom" };
        } else if (
          this.city[corners.topRight.y - 1][corners.topRight.x] ==
            this.TILE_ROAD &&
          this.city[corners.topRight.y][corners.topRight.x + 1] ==
            this.TILE_ROAD
        ) {
          corner = { ...corners.topRight, direction: "left" };
        } else if (
          this.city[corners.bottomRight.y + 1][corners.bottomRight.x] ==
            this.TILE_ROAD &&
          this.city[corners.bottomRight.y][corners.bottomRight.x - 1] ==
            this.TILE_ROAD
        ) {
          corner = { ...corners.bottomRight, direction: "right" };
        } else {
          corner = { ...corners.bottomRight, direction: "top" };
        }
        this.PlaceRectangle(corner, blockSize);
        this.addRoadsAroundLand();
      } else {
        direction =
          citySizeX > citySizeY
            ? this.randomGround(citySizeX + citySizeY) > 0.5
              ? "bottom"
              : "top"
            : citySizeY > citySizeX
            ? this.randomGround(citySizeX + citySizeY) > 0.5
              ? "right"
              : "left"
            : direction;
        let roadTile = this.FindRandomRoadTile(blockSize, direction);
        if (roadTile != null) {
          this.PlaceRectangle(roadTile, blockSize);
          this.addRoadsAroundLand();
        }
      }
    } else {
      let roadTile = this.FindRandomRoadTile(blockSize, direction);
      if (roadTile != null) {
        this.PlaceRectangle(roadTile, blockSize);
        this.addRoadsAroundLand();
      }
    }
    return null;
  }

  PlaceRectangle(
    corner: { x: number; y: number; direction: string },
    rectangleSize: THREE.Vector2
  ): boolean {
    let startX, startY, endX, endY;

    if (corner.direction === "bottom") {
      // If the space is below, the corner is the top-left of the rectangle
      startX = corner.x;
      startY = corner.y;
      endX = corner.x + rectangleSize.x;
      endY = corner.y + rectangleSize.y;
    } else if (corner.direction === "left") {
      // corner is the top right of the rectangle
      startX = corner.x - rectangleSize.x + 1;
      startY = corner.y;
      endX = corner.x + 1;
      endY = corner.y + rectangleSize.y + 1;
    } else if (corner.direction === "top") {
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
      return false;
    }

    // Fill in the rectangle
    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {
        this.city[y][x] = this.TILE_LAND;
      }
    }
    return true;
  }

  addRoadsAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.city));

    for (let y = 0; y < this.city.length; y++) {
      for (let x = 0; x < this.city[y].length; x++) {
        // Check if the current cell is a land
        if (this.city[y][x] === 1) {
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
                  copyCityGrid[y + yOffset][x + xOffset] = 2;
                }
              }
            }
          }
        }
      }
    }
    this.city = copyCityGrid;
  }

  addGrassAroundLand(): void {
    let copyCityGrid = JSON.parse(JSON.stringify(this.city)); // Create a deep copy of the city grid

    for (let y = 0; y < this.city.length; y++) {
      for (let x = 0; x < this.city[y].length; x++) {
        // Check if the current cell is a land
        if (this.city[y][x] === this.idxToRule["InnerGrass"]) {
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
                    this.idxToRule["InnerGrass"];
                }
              }
            }
          }
        }
      }
    }
    this.city = copyCityGrid;
  }

  CheckSpaceForRectangle(
    corner: any,
    rectangleSize: THREE.Vector2,
    direction: string
  ): boolean {
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

    // Check if the rectangle would go out of bounds
    if (
      endX < 0 ||
      endX >= this.citySize ||
      endY < 0 ||
      endY >= this.citySize
    ) {
      console.log("BORDER reached");
      return false;
    }

    // Check if the area required for the rectangle is empty
    for (let y = corner.y; y !== endY; y += increment.y) {
      for (let x = corner.x; x !== endX; x += increment.x) {
        // If the current tile is not empty (0), return false
        if (this.city[y][x] !== 0) {
          return false;
        }
      }
    }
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
      if (
        // skip those groups for now
        roadGroup.name !== "Grass" &&
        roadGroup.active
      ) {
        let idx = this.idxToRule[roadGroup.name as string];

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
                    const seed = Math.abs(this.randomGround(rule.perlinSeed));
                    if (
                      rule.chance === 1 ||
                      (rule.chance !== 1 && seed > rule.chance)
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

                      if (rule.pivotX !== 0 || rule.pivotY !== 0) {
                        console.log("HERE PIVOT");
                      }

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
}

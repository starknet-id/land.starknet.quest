import { num, number } from "starknet";
import { Entity } from "./ldtk";

type IconProps = {
  color: string;
  width: string;
};

type Identity = {
  id: string;
  addr: string;
  domain: string;
  is_owner_main: Boolean;
  error?: string;
};

type StarkscanNftProps = {
  animation_url: string | null;
  attributes: Attribute[];
  contract_address: string;
  description: string | null;
  external_url: string;
  image_url: string | null;
  image_medium_url: string | null;
  image_small_url: string | null;
  minted_at_transaction_hash: string | null;
  minted_by_address: string | null;
  token_id: string;
  name: string | null;
  nft_id: string | null;
  token_uri: string | null;
};

type StarkscanApiResult = {
  data: StarkscanNftProps[];
  next_url?: string;
  remainder?: StarkscanNftProps[];
};

export interface CityBuilded {
  tileId: number;
  flipX: boolean;
  flipY: boolean;
}

export interface CityBuildings {
  tile: TileRect | null;
  isOccupied: boolean;
  isHidden: boolean;
}

export interface CityProps {
  entityType: PropsTypes;
  corner: string;
  z: number;
}

export interface ClosestCorner {
  h: number;
  w: number;
  col: number;
  row: number;
  corner: string;
}

export interface Pos {
  x: number;
  y: number;
}

export interface Size {
  x: number;
  y: number;
}

export interface CitySize {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  citySizeX: number;
  citySizeY: number;
}

export interface pointLightProps {
  intensity: number;
  color: string;
  z: number;
  distance?: number;
  decay?: number;
  power?: number;
  type: LightTypes;
}

export interface CityLight {
  x: number;
  y: number;
  offset: Coord;
  type: string;
  props: pointLightProps | null;
  posX: number;
  posY: number;
}

export interface SpriteBounds {
  spriteTileIdTopLeft: number;
  spriteTileIdTopRight: number;
  spriteTileIdBottomLeft: number;
  spriteTileIdBottomRight: number;
}

export interface userNFTsProps {
  totalNFTs: number;
  braavosCounter: number;
  argentxCounter: number;
  starkFighterLevel: number;
  hasZkLend: boolean;
  hasAVNU: boolean;
  hasJediSwap: boolean;
  hasSIDShield: boolean;
  hasSIDTotem: boolean;
}

export interface CityObjectsProps {
  posX: number;
  posY: number;
  offset: { x: number; y: number; z: number };
  corner?: string;
  side?: string;
}

export interface TileData {
  entity: any;
  plane: { w: number; h: number };
  textureOffset: Coord;
  textureRepeat: Coord;
  z: number;
}

export type Coord = {
  x: number;
  y: number;
};

export type CityCenterProps = {
  center: Coord;
  boundaries: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
};

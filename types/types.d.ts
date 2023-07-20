import { num, number } from "starknet";
import { Entity } from "./ldtk";

type Identity = {
  id: string;
  addr: string;
  domain: string;
  is_owner_main: Boolean;
  error?: string;
};

type AspectNftProps = {
  contract_address: string;
  token_id: string;
  name: string | null;
  description: string | null;
  token_uri: string | null;
  image_uri: string | null;
  image_blur_hash: string | null;
  image_url_copy: string | null;
  image_small_url_copy: string | null;
  image_medium_url_copy: string | null;
  animation_uri: string | null;
  external_uri: string;
  null;
  attributes: Attribute[];
  contract: any;
  owner: {
    account_address: string;
    quantity: string;
  };
  aspect_link: string;
};

type AspectApiResult = {
  assets: AspectNftProps[];
  next_url?: string;
  remainder?: AspectNftProps[];
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
  offset: { x: number; y: number };
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
  textureOffset: { x: number; y: number };
  textureRepeat: { x: number; y: number };
  z: number;
}

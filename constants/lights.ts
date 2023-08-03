import { pointLightProps } from "@/types/types";

export enum LightTypes {
  BLUE_1 = 0,
  PINK_1 = 1,
  YELLOW_1 = 2,
  GREEN_1 = 3,
  WHITE_1 = 4,
  ORANGE_1 = 5,
  PURPLE_1 = 6,
  GREEN_2 = 7,
  RED_1 = 8,
}

export const LightsTypesNames = {
  [LightTypes.BLUE_1]: "Light_Blue1_Small",
  [LightTypes.PINK_1]: "Light_Pink1_Small",
  [LightTypes.YELLOW_1]: "Light_Yellow1_Small",
  [LightTypes.GREEN_1]: "Light_Green1_Small",
  [LightTypes.WHITE_1]: "Light_White1_Small",
  [LightTypes.ORANGE_1]: "Light_Orange1_Small",
  [LightTypes.PURPLE_1]: "Light_Purple1_Small",
  [LightTypes.GREEN_2]: "Light_Green1_Small",
  [LightTypes.RED_1]: "Light_Red1_Small",
};

export const pointLightsData: { [key: string]: pointLightProps } = {
  pink1: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
    type: LightTypes.PINK_1,
  },
  pink2: {
    intensity: 0.8,
    color: "pink",
    z: 0.6,
    distance: 50,
    decay: 4,
    type: LightTypes.PINK_1,
  },
  green1: {
    intensity: 3,
    color: "#8fca58",
    z: 0.8,
    distance: 20,
    decay: 5,
    type: LightTypes.GREEN_1,
  },
  green2: {
    intensity: 1.7,
    color: "#48dda0",
    z: 2.6,
    distance: 30,
    decay: 4,
    type: LightTypes.GREEN_2,
  },
  yellow1: {
    intensity: 0.8,
    color: "#e8c170",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.YELLOW_1,
  },
  yellow2: {
    intensity: 0.8,
    color: "yellow",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.YELLOW_1,
  },
  white1: {
    intensity: 1.8,
    color: "#ffffff",
    z: 1.2,
    distance: 30,
    decay: 7,
    type: LightTypes.WHITE_1,
  },
  purple1: {
    intensity: 1,
    color: "#f21bb9",
    z: 1.2,
    distance: 20,
    decay: 4,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
  purple3: {
    intensity: 1,
    color: "#f21bb9",
    z: 1.2,
    distance: 20,
    decay: 4,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
  orange1: {
    intensity: 2.8,
    color: "orange",
    z: 1.1,
    distance: 20,
    decay: 5,
    type: LightTypes.ORANGE_1,
  },
  blue1: {
    intensity: 2.8,
    color: "#2595ba",
    z: 1.2,
    distance: 20,
    decay: 4,
    type: LightTypes.BLUE_1,
  },
  blue2: {
    intensity: 0.8,
    color: "blue",
    z: 0.6,
    distance: 50,
    decay: 10,
    type: LightTypes.BLUE_1,
  },
  red1: {
    intensity: 2.8,
    color: "#f75c5f",
    z: 0.6,
    distance: 50,
    decay: 10,
    power: 40,
    type: LightTypes.RED_1,
  },
  street1: {
    intensity: 2.2,
    color: "#e6b9f0",
    z: 0.4,
    distance: 100,
    decay: 15,
    power: 30,
    type: LightTypes.PURPLE_1,
  },
};

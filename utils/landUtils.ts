import { ClosestCorner } from "@/types/types";

export const convertTo2D = (array: Array<number>, size: number) => {
  let result: Array<Array<number>> = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const findRectangleCorners = (
  array: number[][],
  startX: number,
  startY: number
) => {
  const visited = array.map((row) => row.map(() => false));

  let topLeft = { x: Infinity, y: Infinity };
  let bottomRight = { x: -Infinity, y: -Infinity };

  function dfs(x: number, y: number) {
    if (x < 0 || x >= array[0].length || y < 0 || y >= array.length) {
      return;
    }

    if (array[y][x] === 0 || visited[y][x]) {
      return;
    }

    visited[y][x] = true;

    topLeft.x = Math.min(topLeft.x, x);
    topLeft.y = Math.min(topLeft.y, y);
    bottomRight.x = Math.max(bottomRight.x, x);
    bottomRight.y = Math.max(bottomRight.y, y);

    dfs(x + 1, y);
    dfs(x - 1, y);
    dfs(x, y + 1);
    dfs(x, y - 1);
  }

  dfs(startX, startY);

  console.log("visited", visited);

  return { topLeft, bottomRight };
};

export const getOffsetFromDirection = (
  direction: string
): { offsetX: number; offsetY: number; direction: string }[] => {
  let offsets: { offsetX: number; offsetY: number; direction: string }[] = [];
  switch (direction) {
    case "left":
      offsets.push({ offsetX: -1, offsetY: 0, direction: "left" });
      break;
    case "right":
      offsets.push({ offsetX: 1, offsetY: 0, direction: "right" });
      break;
    case "top":
      offsets.push({ offsetX: 0, offsetY: -1, direction: "top" });
      break;
    case "bottom":
      offsets.push({ offsetX: 0, offsetY: 1, direction: "bottom" });
      break;
    case "random":
      offsets = [
        { offsetX: -1, offsetY: 0, direction: "left" }, // left
        { offsetX: 1, offsetY: 0, direction: "right" }, // right
        { offsetX: 0, offsetY: -1, direction: "top" }, // top
        { offsetX: 0, offsetY: 1, direction: "bottom" }, // bottom
      ];
      break;
  }
  return offsets;
};

export const printSubArray = (
  arr: any[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  let myArr: number[][] = [];
  for (let i = minY; i <= maxY; i++) {
    myArr[i] = [];
    let row = [];
    for (let j = minX; j <= maxX; j++) {
      myArr[i][j] = arr[i][j];
      row.push({ value: arr[i][j], y: i, x: j });
    }
  }
  console.log("myArr", myArr);
};

export const getSubArray = (
  arr: number[][],
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  let myArr: number[][] = [];
  for (let i = minY; i <= maxY; i++) {
    myArr[i - minY] = [];
    for (let j = minX; j <= maxX; j++) {
      myArr[i - minY][j - minX] = arr[i][j];
    }
  }
  return myArr;
};

export const decompose = (
  n: number,
  curr: any[] = [],
  solutions: any[] = []
) => {
  // Base case: if n is 0, we have found a valid decomposition
  if (n === 0) {
    const sortedCurr = curr.sort((a, b) => a - b);
    if (
      !solutions.find(
        (sol) => JSON.stringify(sol) === JSON.stringify(sortedCurr)
      )
    ) {
      solutions.push(sortedCurr);
    }
  } else {
    // Try subtracting 2, 3, 4, and 5 from n
    for (let i = 2; i <= 5; i++) {
      if (n - i >= 0) {
        decompose(n - i, [...curr, i], solutions);
      }
    }
  }

  return solutions;
};

export const shuffleArray = (array: number[], rand: number) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(rand * (i + 1)); // random index from 0 to i
    // swap elements array[i] and array[j]
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const distance = (
  center: { x: number; y: number },
  corner: { row: number; col: number }
) => {
  return Math.sqrt(
    Math.pow(corner.col - center.x, 2) + Math.pow(corner.row - center.y, 2)
  );
};

export const findClosestCorner = (
  center: { x: number; y: number },
  corners: ClosestCorner[]
): ClosestCorner | null => {
  let closestCorner = null;
  let closestDistance = Infinity;

  for (const corner of corners) {
    let dist = distance(center, corner);
    if (dist < closestDistance) {
      closestDistance = dist;
      closestCorner = corner;
    }
  }

  return closestCorner;
};

export const calculateCityCenter = (
  minX: number,
  maxX: number,
  minY: number,
  maxY: number
) => {
  return {
    x: Math.floor((minX + maxX) / 2) - minX,
    y: Math.floor((minY + maxY) / 2) - minY,
  };
};

export const needsDirectionChange = (
  closestCorner: ClosestCorner,
  subArr: any[],
  blockSize: THREE.Vector2
) => {
  if (
    ((closestCorner?.corner === "topRight" ||
      closestCorner?.corner === "bottomRight") &&
      closestCorner.col < Math.floor(blockSize.x / 3)) ||
    ((closestCorner?.corner === "topLeft" ||
      closestCorner?.corner === "bottomLeft") &&
      subArr[0].length - closestCorner.col < Math.floor(blockSize.x / 3))
  ) {
    return true;
  }
  return false;
};

export const setDirectionBasedOnCorner = (
  closestCorner: ClosestCorner
): string => {
  switch (closestCorner.corner) {
    case "topRight":
      return "left";
    case "topLeft":
      return "right";
    case "bottomLeft":
      return "top";
    case "bottomRight":
      return "bottom";
  }
  return "";
};

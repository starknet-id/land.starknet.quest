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

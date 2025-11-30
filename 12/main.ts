import { Vector } from "./vector.ts";

async function readFile(path: string): Promise<string> {
  const contents = await Deno.readFile(path);
  const input = new TextDecoder().decode(contents).trim();
  return input;
}

function extractGrid(input: string): string[][] {
  return input.split("\n").map((line) => line.split(""));
}

function checkBounds(
  pos: Vector,
  gridWidth: number,
  gridHeight: number,
): boolean {
  return pos.x >= 0 && pos.x < gridWidth && pos.y >= 0 && pos.y < gridHeight;
}

function getNeighbors(pos: Vector): Vector[] {
  const neighborDirs: Vector[] = [
    new Vector(-1, 0),
    new Vector(1, 0),
    new Vector(0, -1),
    new Vector(0, 1),
  ];

  return neighborDirs.map((dir) => pos.add(dir));
}

function getRelatedNeighbors(
  pos: Vector,
  grid: string[][],
  value: string,
): Vector[] {
  const neighbors = getNeighbors(pos);
  return neighbors.filter(
    (v) =>
      checkBounds(v, grid.length, grid[0].length) && grid[v.x][v.y] === value,
  );
}

// function findRegion(
// 	grid: string[][],
// 	visitedGrid: boolean[][],
// 	startPos: Vector,
// ): { area: number; perimeter: number } {
// 	const value = grid[startPos.x][startPos.y];

// 	let area = 0;
// 	let perimeter = 0;

// 	const cells: Vector[] = [startPos];

// 	while (true) {
// 		const relatedNeighbors = getRelatedNeighbors(
// 			cells[cells.length - 1],
// 			grid,
// 			value,
// 		);

// 		if (relatedNeighbors.length === 0 || relatedNeighbors.every(v => cells.includes(v)) || relatedNeighbors.every(v => visitedGrid[v.x][v.y])) break;

// 		cells.push(...relatedNeighbors);
// 	}

// 	cells.forEach((cell) => {
// 		area += 1;
// 		perimeter += 4 - getRelatedNeighbors(cell, grid, value).length;
// 		visitedGrid[cell.x][cell.y] = true;
// 	});

//   console.log(value, area, perimeter);

// 	return { area, perimeter };
// }

function findRegion(
  grid: string[][],
  visitedGrid: boolean[][],
  startPos: Vector,
): { area: number; perimeter: number } {
  const value = grid[startPos.x][startPos.y];

  let area = 0;
  let perimeter = 0;

  const stack: Vector[] = [startPos];
  visitedGrid[startPos.x][startPos.y] = true;

  while (stack.length > 0) {
    const current = stack.pop()!;
    area += 1;

    const neighbors = getNeighbors(current);

    neighbors.forEach((neighbor) => {
      if (
        !checkBounds(neighbor, grid.length, grid[0].length) ||
        grid[neighbor.x][neighbor.y] !== value
      ) {
        perimeter += 1;
        return;
      }

      if (!visitedGrid[neighbor.x][neighbor.y]) {
        visitedGrid[neighbor.x][neighbor.y] = true;
        stack.push(neighbor);
      }
    });
  }

  console.log(value, area, perimeter);
  return { area, perimeter };
}
function findClockWiseNeighbor(
  current: Vector,
  x: number,
  y: number,
  neighbor,
): Vector {
  if (x === 0) {
    return { x: current.x + 1, y: current.y };
  }
  return { x: current.x + 1, y: current.y };
}
function findRegionB(
  grid: string[][],
  visitedGrid: boolean[][],
  startPos: Vector,
): { area: number; perimeter: number } {
  const value = grid[startPos.x][startPos.y];

  let area = 0;
  let perimeter = 0;

  const stack: Vector[] = [startPos];
  visitedGrid[startPos.x][startPos.y] = true;

  while (stack.length > 0) {
    const current = stack.pop()!;
    area += 1;

    const neighbors = getNeighbors(current);
    console.log("nm", neighbors);
    const condition = neighbors.filter((n) =>
      checkBounds(n, grid.length, grid[0].length)
    );
    console.log(current);
    console.log(condition);

    if (condition.length === 2) {
      console.log(
        !(neighbors[0].x === current.x && neighbors[1].x === current.x),
      );
      console.log(
        !(neighbors[0].y === current.y && neighbors[1].y === current.y),
      );
      if (
        !((neighbors[0].x === current.x && neighbors[1].x === current.x) ||
          (neighbors[0].y === current.y && neighbors[1].y === current.y))
      ) {
        perimeter += 1;
      }
    } else if (condition.length === 1) {
      perimeter += 3;
    } else if (condition.length === 0) {
      perimeter += 4;
    }
    console.log(perimeter);
    neighbors.forEach((neighbor) => {
      if (
        !checkBounds(neighbor, grid.length, grid[0].length) ||
        grid[neighbor.x][neighbor.y] !== value
      ) {
        // perimeter += 1;
        return;
      }

      if (!visitedGrid[neighbor.x][neighbor.y]) {
        visitedGrid[neighbor.x][neighbor.y] = true;
        stack.push(neighbor);
      }
    });
  }

  console.log(value, area, perimeter);
  return { area, perimeter };
}

async function main() {
  const grid = extractGrid(await readFile("test-input.txt"));
  const gridHeight = grid.length;
  const gridWidth = grid[0].length;

  const visitedGrid = Array.from(
    { length: gridHeight },
    () => Array(gridWidth).fill(false),
  );

  let sum = 0;

  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
      if (!visitedGrid[i][j]) {
        const { area, perimeter } = findRegionB(
          grid,
          visitedGrid,
          new Vector(i, j),
        );
        sum += area * perimeter;
      }
    }
  }

  return sum;
}

if (import.meta.main) {
  const answer = await main();
  console.log(answer);
}

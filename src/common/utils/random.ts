export function getRandomInt(min: number, max: number) { // [min, max)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

export function createIndexArray (total: number) {
  return Array.from(Array(total).keys()).map(number => number + 1)
}
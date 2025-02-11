export function randomFloat(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

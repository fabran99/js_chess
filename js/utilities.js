const getEl = (id) => document.getElementById(id);

const clearDiv = (node) => {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
};

const getSquareByPosition = (row, column) => {
  let col_number = "abcdefgh".split("").indexOf(column) + 1;
  let selector = `.row:nth-child(${9 - row}) .square:nth-child(${col_number})`;

  return document.querySelector(selector);
};

const normalizeSquares = () => {
  document.querySelectorAll(".square").forEach((el) => {
    el.className = "square";
    el.onclick = null;
  });
};

const moveColumn = (column, amount) => {
  const columns = "abcdefgh".split("");
  let currentPosition = columns.indexOf(column);
  let nextValue = currentPosition + amount;
  if (nextValue >= 0 && nextValue < columns.length) {
    return columns[nextValue];
  }
  return null;
};

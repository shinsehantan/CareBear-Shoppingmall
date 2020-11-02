const categories = [
  {
    _id: 1,
    name: "doll",
  },
  {
    _id: 2,
    name: "clothes",
  },
  {
    _id: 3,
    name: "phone case",
  },
  {
    _id: 4,
    name: "stickers",
  },
  {
    _id: 5,
    name: "mobile acc",
  },
  {
    _id: 6,
    name: "note",
  },
  {
    _id: 7,
    name: "pen",
  },
];

const price = [
  {
    _id: 0,
    name: "Any",
    array: [],
  },
  {
    _id: 1,
    name: "$0 to $9",
    array: [0, 9],
  },
  {
    _id: 2,
    name: "$10 to $19",
    array: [10, 19],
  },
  {
    _id: 3,
    name: "$20 to $29",
    array: [20, 29],
  },
  {
    _id: 4,
    name: "$30 to $39",
    array: [30, 39],
  },
  {
    _id: 5,
    name: "$40 to $49",
    array: [40, 49],
  },
  {
    _id: 6,
    name: "More than $50",
    array: [50, 1500000],
  },
];
export { categories, price };

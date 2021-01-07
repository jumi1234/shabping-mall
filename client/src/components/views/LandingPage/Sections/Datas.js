const continents = [
  {
    "_id": 1,
    "name": "Africa"
  },
  {
    "_id": 2,
    "name": "Asia"
  },
  {
    "_id": 3,
    "name": "Europe"
  },
  {
    "_id": 4,
    "name": "North America"
  },
  {
    "_id": 5,
    "name": "South America"
  },
  {
    "_id": 6,
    "name": "Australia"
  },
  {
    "_id": 7,
    "name": "Antarctica"
  },
]

const price = [
  {
    "_id": 0,
    "name": "선택 안 함",
    "array": []
  },
  {
    "_id": 1,
    "name": "₩0~₩99000",
    "array": [0, 99000]
  },
  {
    "_id": 2,
    "name": "₩100000~₩199000",
    "array": [100000, 199000]
  },
  {
    "_id": 3,
    "name": "₩200000~₩299000",
    "array": [200000, 299000]
  },
  {
    "_id": 4,
    "name": "₩300000 이상",
    "array": [300000, 10000000]
  }
]

export {
  continents,
  price
}

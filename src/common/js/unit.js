function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, 1)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

export function getArrayItems(arr, num) {
  let temp_arr = new Array()
  arr.forEach((item) => {
    temp_arr.push(item)
  })
  var return_arr = new Array()
  for (var i = 0; i < num; i++) {
    if (temp_arr.length > 0) {
      var rand_index = Math.floor(Math.random() * temp_arr.length)
      return_arr[i] = temp_arr[rand_index]
      temp_arr.splice(rand_index, 1)
    } else {
      break;
    }
  }
  return return_arr
}
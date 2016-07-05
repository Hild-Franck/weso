const through = require('through2')

const streamCheck = stream => stream.pipe && stream.on

const stream = (weso, route, format, data) => {
  if (streamCheck(data)) {
    data.pipe(through((chunck, enc, next) => {
      weso.broadcast(route + format(chunck))

      next()
    }))
  }
}

module.exports = stream
var passthrough = require('passthrough-encoding')

module.exports = DB

function DB (storage, opts) {
  if (!(this instanceof DB)) return new DB(storage, opts)
  if (!opts) opts = {}

  this._storage = storage
  this._offset = opts.offset || calcOffset
  this.valueLength = opts.valueLength || 0
  this.valueEncoding = opts.valueEncoding || passthrough
}

DB.prototype.put = function (index, value, cb) {
  var buf = this.valueEncoding.encode(value)

  this._storage.write(this._offset(index, this), buf, cb)
}

DB.prototype.del = function (index, cb) {
  var start = this._offset(index, this)
  var end = this._offset(index + 1, this)
  var blank = Buffer(end - start)
  blank.fill(0)

  this._storage.write(start, blank, cb)
}

DB.prototype.get = function (index, cb) {
  var self = this
  var start = this._offset(index, this)
  var end = this._offset(index + 1, this)

  this._storage.read(start, end - start, done)

  function done (err, buf) {
    if (err) return cb(err)
    if (isBlank(buf)) return cb(notFound(index), null)
    cb(null, self.valueEncoding.decode(buf))
  }
}

DB.prototype.close = function (cb) {
  this._storage.close(cb)
}

function notFound (index) {
  var err = new Error('Could not find a value at [' + index + ']')
  err.notFound = true
  err.status = 404
  return err
}

function isBlank (buf) {
  for (var i = 0; i < buf.length; i++) {
    if (buf[i] !== 0) return false
  }
  return true
}

function calcOffset (index, db) {
  return db.valueLength * index
}

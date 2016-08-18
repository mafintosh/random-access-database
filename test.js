var tape = require('tape')
var ram = require('random-access-memory')
var database = require('./')

tape('put and get', function (t) {
  var db = database(ram(), {valueLength: 5})

  db.put(0, 'hello', function () {
    db.put(1, 'world', function () {
      db.get(0, function (err, val) {
        t.error(err, 'no error')
        t.same(val, Buffer('hello'))
        db.get(1, function (err, val) {
          t.error(err, 'no error')
          t.same(val, Buffer('world'))
          t.end()
        })
      })
    })
  })
})

tape('get non existent', function (t) {
  var db = database(ram(), {valueLength: 5})

  db.put(10, 'hello', function () {
    db.get(0, function (err) {
      t.ok(err, 'returned error')
      db.get(11, function (err) {
        t.ok(err, 'returned error')
        t.end()
      })
    })
  })
})

tape('put, get, del', function (t) {
  var db = database(ram(), {valueLength: 5})

  db.put(0, 'hello', function () {
    db.get(0, function (err, val) {
      t.error(err, 'no error')
      t.same(val, Buffer('hello'))
      db.del(0, function () {
        db.get(0, function (err) {
          t.ok(err, 'returned error')
          t.end()
        })
      })
    })
  })
})

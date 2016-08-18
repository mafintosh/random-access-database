# random-access-database

Store fixed size values in an [abstract-random-access](https://github.com/juliangruber/abstract-random-access) compatible storage provider

```
npm install random-access-database
```

[![build status](http://img.shields.io/travis/mafintosh/random-access-database.svg?style=flat)](http://travis-ci.org/mafintosh/random-access-database)

## Usage

``` js
var rad = require('random-access-database')
var raf = require('random-access-file')

var db = rad(raf('db'), {valueLength: 5})

db.put(0, 'hello', function (err) {
  if (err) throw err
  db.get(0, function (err, val) {
    if (err) throw err
    console.log('stored at 0:', val)
  })
})
```

## API

#### `var db = rad(storage, options)`

Create a new databae. `storage` should be an [abstract-random-access](https://github.com/juliangruber/abstract-random-access) compatible storage provider. Options include

``` js
{
  valueEncoding: encodeValuesUsingThisEncoding,
  valueLength: lengthOfAllValues,
  offset: functionThatReturnsValueOffset
}
```

You must either set the `valueLength` of `offset` option. The `offset` option is called with the numeric index of a value and should return the byte offset of this value.

#### `db.put(index, value, [callback])`

Insert a value in the database.

#### `db.get(index, callback)`

Retrieve a value from the database. Callback is called with `(err, value)`.

#### `db.del(index, [callback])`

Delete a value from the database. Will blank it out in the underlying storage.

## License

MIT

const TableStore = require('tablestore')
const Long = TableStore.Long
const R = require('ramda')
const Joi = require('joi')

const client = function (config) {
  return new Promise((resolve, reject) => {
    try {
      const ts = new TableStore.Client(config)
      resolve(ts)
    } catch (err) {
      reject(err)
    }
  })
}

const orm = {
  config: {},
  params: {},
  init: function (config) {
    this.config = config
    return this
  },
  table: function (tableName) {
    this.params = R.assoc('tableName', tableName, this.params)
    return this
  },
  select: function (...columns) {
    this.params = R.assoc('columnToGet', [...columns], this.params)
    return this
  },
  versions: function (v) {
    this.params = R.assoc('maxVersions', v, this.params)
    return this
  },
  keys: function (keys) {
    const primaryKey = R.reduce((a, v) => {
      return R.append(R.objOf(v[0], R.is(Number, v[1]) ? Long.fromNumber(v[1]) : v[1]), a)
    }, [], R.toPairs(keys))
    this.params = R.assoc('primaryKey', primaryKey, this.params)
    return this
  },
  direction: function (value) {
    this.params = R.assoc('direction', value, this.params)
    return this
  },
  startKeys: function (keys) {
    const values = R.reduce((a, v) => {
      return R.append(R.objOf(v[0], R.is(Number, v[1]) ? Long.fromNumber(v[1]) : v[1]), a)
    }, [], R.toPairs(keys))
    this.params = R.assoc('inclusiveStartPrimaryKey', values, this.params)
    return this
  },
  endKeys: function (keys) {
    const values = R.reduce((a, v) => {
      return R.append(R.objOf(v[0], R.is(Number, v[1]) ? Long.fromNumber(v[1]) : v[1]), a)
    }, [], R.toPairs(keys))
    this.params = R.assoc('exclusiveEndPrimaryKey', values, this.params)
    return this
  },
  limit: function (value) {
    this.params = R.assoc('limit', value, this.params)
    return this
  },
  getRow: function () {
    checkConfig(this.config)
    checkDataForGet(this.params)
    return new Promise((resolve, reject) => {
      try {
        client(this.config).then(ts => ts.getRow(this.params)).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  },
  getRange: function () {
    checkConfig(this.config)
    checkDataForGetRange(this.params)
    return new Promise((resolve, reject) => {
      try {
        client(this.config).then(ts => ts.getRange(this.params)).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    })
  }
}

const checkConfig = function (data) {
  const schema = Joi.object().keys({
    accessKeyId: Joi.string().required(),
    secretAccessKey: Joi.string().required(),
    endpoint: Joi.string().required(),
    instancename: Joi.string().required()
  })
  const result = Joi.validate(data, schema)// , (err, value) => {
  if (result.error) {
    throw new Error(result.error)
  }
  return true
}

const checkDataForGet = function (data) {
  const schema = Joi.object().keys({
    tableName: Joi.string().required(),
    primaryKey: Joi.array().items(Joi.object().required()).required(),
    maxVersions: Joi.number().integer().required()
  })
  const result = Joi.validate(data, schema)// , (err, value) => {
  if (result.error) {
    throw new Error(result.error)
  }
  return true
}

const checkDataForGetRange = function (data) {
  const schema = Joi.object().keys({
    tableName: Joi.string().required(),
    direction: Joi.string().valid(TableStore.Direction.FORWARD, TableStore.Direction.BACKWARD).required(),
    inclusiveStartPrimaryKey: Joi.array().items(Joi.object().required()).required(),
    exclusiveEndPrimaryKey: Joi.array().items(Joi.object().required()).required(),
    limit: Joi.number().integer()
  })
  const result = Joi.validate(data, schema)
  if (result.error) {
    throw new Error(result.error)
  }
  return true
}

const formatRow = function (row) {
  if (R.isNil(row) || R.isEmpty(row)) return row
  const keys = R.reduce((a, v) => {
    const kv = R.values(v)
    return R.assoc(kv[0], kv[1], a)
  }, {}, row.primaryKey)
  const attributes = R.reduce((a, v) => {
    const kv = R.values(v)
    return R.assoc(kv[0], kv[1], a)
  }, {}, row.attributes)
  return R.merge(keys, attributes)
}

const formatRange = function (data) {
  if (R.isNil(data) || R.isEmpty(data)) return data
  if (R.isEmpty(data.rows) || R.isNil(data.rows)) return data
  return R.assoc('rows', R.map(formatRow, data.rows), data)
}

module.exports = {
  orm,
  checkConfig,
  checkDataForGet,
  checkDataForGetRange,
  formatRange,
  formatRow
}

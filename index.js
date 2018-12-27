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
        console.log('出错了:' + err.message)
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
    console.log(`出现错误：${result.error.details[0]['message']}, 请确认参数是否已经合理设定！`)
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
    console.log(`出现错误：${result.error.details[0]['message']}, 请确认参数是否已经合理设定！`)
    throw new Error(result.error)
  }
  return true
}

module.exports = {
  orm,
  checkConfig,
  checkDataForGet
}

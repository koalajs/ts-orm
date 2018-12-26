const TableStore = require('tablestore')
const Long = TableStore.Long
const R = require('ramda')

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
  maxVersion: function (v) {
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
  attr: function (attr) {
    // 处理attr结构问题
    return this
  },
  getRow: function () {
    checkDataForGet(this)
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

const checkDataForRange = function (data) {
  return true
}

const checkDataForGet = function (data) {
  checkConfig(data.config)
  checkParamTableName(data)
  checkParamKey(data)
}

const isNilOrEmpty = R.either(R.isNil, R.isEmpty)

const checkConfig = function (config) {
  if (isNilOrEmpty(config)) {
    throw new Error('config配置是必须的,需要执行.init')
  }
  const keys = R.keys(config)
  const needKeys = ['accessKeyId', 'secretAccessKey', 'endpoint', 'instancename']
  if (!R.equals(keys, needKeys)) {
    throw new Error('config配置项错误， 必须包含： accessKeyId， secretAccessKey， endpoint， instancename')
  }
  return true
}

const checkParamTableName = function (data) {
  if (isNilOrEmpty(R.path(['params', 'tableName'], data))) {
    throw new Error('table配置是必须，需要执行.table')
  }
  if (!R.is(String, R.path(['params', 'tableName'], data))) {
    throw new Error('table配置必须是一个字符串')
  }
  return true
}

const checkParamKey = function (data) {
  if (isNilOrEmpty(R.path(['params', 'primaryKey'], data))) {
    throw new Error('keys配置是必须，需要执行.table')
  }
  if (!R.is(Object, R.path(['params', 'primaryKey'], data))) {
    throw new Error('keys配置必须是一个Object')
  }
  return true
}

const checkParamStartKeys = function (data) {
  throw new Error('start配置是必须的，需要执行.startKeys')
}

const test = function (data) {
  return 'hello world'
}

module.exports = {
  test,
  orm,
  isNilOrEmpty,
  checkConfig,
  checkParamTableName,
  checkParamKey,
  checkParamStartKeys,
  checkDataForGet,
  checkDataForRange
}

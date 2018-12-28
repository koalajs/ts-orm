const mod = require('../index')
const TableStore = require('tablestore')
const demoData = require('./demo-return-data.js')

describe('检查formatRow', () => {
  it('检查数据为空或null事后，原样返回数据', () => {
    expect(mod.formatRow(null)).toBeNull()
  })
})

describe('检查formatRange', () => {
  it('检测数据为空或null进入的处理，应为原样返回', () => {
    expect(mod.formatRange(null)).toBeNull()
    expect(mod.formatRange({})).toEqual({})
  })
  it('检测Row数据为空或null进入的处理，应为原样返回', () => {
    const data = {
      row: {},
      next_token: null
    }
    const dataWithNull = {
      row: null,
      next_token: null
    }
    expect(mod.formatRange(data)).toEqual(data)
    expect(mod.formatRange(dataWithNull)).toEqual(dataWithNull)
  })
  it('检测Row数据合法的情况下，返回处理好的格式数据', () => {
    expect(mod.formatRange(demoData.returnData)).toEqual(demoData.formatData)
  })
})

describe('检查getRange部分', () => {
  it ('检查direction设定： 给定参数得到正确设定值', () => {
    const value = 'xxx'
    mod.orm.direction(value)
    expect(mod.orm.params.direction).toEqual(value)
  })
  it ('检查startKeys设定： 给定参数得到正确设定值', () => {
    const keys = {
      a: 'aaa',
      b: 'bbb'
    }
    const result = [
      { a: 'aaa' },
      { b: 'bbb' }
    ]
    mod.orm.startKeys(keys)
    expect(mod.orm.params.inclusiveStartPrimaryKey).toEqual(result)
  })
  it ('检查endKeys设定： 给定参数得到正确设定值', () => {
    const keys = {
      a: 'aaa',
      b: 'bbb'
    }
    const result = [
      { a: 'aaa' },
      { b: 'bbb' }
    ]
    mod.orm.endKeys(keys)
    expect(mod.orm.params.exclusiveEndPrimaryKey).toEqual(result)
  })
  it ('检查limit设定： 给定参数得到正确的设定值', () => {
    const value = 1
    mod.orm.limit(value)
    expect(mod.orm.params.limit).toBe(value)
  })
  it ('检查checkDataForGetRange, 给定错误的参数，报异常', () => {
    const data = {
      tableName: 'xxx',
      direction: 'XXX', //这里正确的应该是TableStore.Direction中的类型
      inclusiveStartPrimaryKey: [{a: 'aaa', b: 'bbb'}],
      exclusiveEndPrimaryKey: [{c: 'ccc', d: 'ddd'}],
      limit: 1
    }
    expect(() => {
      mod.checkDataForGetRange(data)
    }).toThrow()
  })
  it ('检查checkDataForGetRange, 给定正确的参数，通过', () => {
    const data = {
      tableName: 'xxx',
      direction: TableStore.Direction.FORWARD, //这里给定了正确的应该是TableStore.Direction中的类型
      inclusiveStartPrimaryKey: [{a: 'aaa', b: 'bbb'}],
      exclusiveEndPrimaryKey: [{c: 'ccc', d: 'ddd'}],
      limit: 1
    }
    expect(mod.checkDataForGetRange(data)).toBe(true)
  })
})


const mod = require('../index')
const TableStore = require('tablestore')

describe('检测deleteRow部分', () => {
  it ('检测参数condition设定， 得到参数值', () => {
    const value = new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null)
    mod.orm.condition(value)
    expect(mod.orm.params.condition).toBe(value)
  })
  it ('检查keys设定： 得到设定参数值', () => {
    const data = {
      a: 'aa',
      b: 'bb'
    }
    mod.orm.keys(data)
    expect(mod.orm.params.primaryKey).toEqual([{ a: 'aa' }, { b: 'bb' }])
  })
  it ('检测checkDataForDeleteRow: 数据格式错误， 报异常', () => {
    const data = {
      tableName: 'xxx',
      primaryKey: [],
      condition: ''
    }
    expect(() => {
      mod.checkDataForDeleteRow(data)
    }).toThrow()
  })
  it ('检测checkDataForDeleteRow: 数据格式正确，通过', () => {
    const data = {
      tableName: 'xxx',
      primaryKey: [{a: 'aa'}],
      condition: 'xxx'
    }
    expect(mod.checkDataForDeleteRow(data)).toBe(true)
  })
})

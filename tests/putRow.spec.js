const mod = require('../index')
const TableStore = require('tablestore')

describe('检测putRow部分', () => {
  it ('检测参数condition设定， 得到参数值', () => {
    const value = new TableStore.Condition(TableStore.RowExistenceExpectation.IGNORE, null)
    mod.orm.condition(value)
    expect(mod.orm.params.condition).toBe(value)
  })
  it ('检测参数参数primaryKey设定， 得到参数值', () => {
    const data = {
      a: 'aa',
      b: 'bb'
    }
    mod.orm.keys(data)
    expect(mod.orm.params.primaryKey).toEqual([{ a: 'aa' }, { b: 'bb' }])
  })
  it ('检测参数参数attr设定， 得到参数值', () => {
    const data = [
      { col1: '1'},
      { col2: '2'},
      { col3: '3'}
    ]
    mod.orm.attr(data)
    expect(mod.orm.params.attributeColumns).toEqual(data)
  })
  it ('检测参数参数returnContent设定， 得到参数值', () => {
    const data = {
      returnType: TableStore.ReturnType.Primarykey
    }
    mod.orm.returnContent(data)
    expect(mod.orm.params.returnContent).toEqual(data)
  })
  it ('检测checkDataForPutRow: 数据格式错误， 报异常', () => {
    const data = {
      tableName: 'xxx',
      primaryKey: [],
      attributeColumns: [],
      returnContent: 'xxx'
    }
    expect(() => {
      mod.checkDataForPutRow(data)
    }).toThrow()
  })
  it ('检测checkDataForPutRow: 数据格式正确，通过', () => {
    const data = {
      tableName: 'xxx',
      primaryKey: [{a: 'aa'}],
      attributeColumns: [{a: 'aa'}],
      returnContent: 'xxx'
    }
    expect(mod.checkDataForPutRow(data)).toBe(true)
  })
})

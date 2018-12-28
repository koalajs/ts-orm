const mod = require('../index')
const TableStore = require('tablestore')

describe('检测getRow部分', () => {
  it ('检查select设定： 得到设定参数值', () => {
    mod.orm.select('a', 'b', 'c')
    expect(mod.orm.params.columnToGet).toEqual(['a', 'b', 'c'])
  })
  it ('检查versions设定： 得到设定参数值', () => {
    mod.orm.versions(3)
    expect(mod.orm.params.maxVersions).toEqual(3)
  })
  it ('检查keys设定： 得到设定参数值', () => {
    const data = {
      a: 'aa',
      b: 'bb'
    }
    mod.orm.keys(data)
    expect(mod.orm.params.primaryKey).toEqual([{ a: 'aa' }, { b: 'bb' }])
  })
  it ('检查getRow： 给定错误参数，得到异常报错', () => {
    expect(() => {
      mod.orm.getRow()
    }).toThrow()
  })
  it('检查checkDataForGet，给定错误的参数， 报异常', () => {
    const data = {
      tableName: 'xxx',
      maxVersions: 1,
      primaryKey: [] // 这里给定了一个错误的参数格式
    }
    expect(() => {
      mod.checkDataForGet(data)
    }).toThrow()
  })
  it('检查checkDataForGet，给定正确的参数， 通过', () => {
    const data = {
      tableName: 'xxxx',
      maxVersions: 1,
      primaryKey: [{}]
    }
    expect(mod.checkDataForGet(data)).toBe(true)
  })
})

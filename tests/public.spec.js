const mod = require('../index')

describe('测试公共部分', () => {
  it ('检查config设定： 得到设定参数值', () => {
    const config = {
        accessKeyId: 'xxx',
        secretAccessKey: 'xxx',
        endpoint: 'xxx',
        instancename: 'xxxx'
    }
    mod.orm.init(config)
    expect(mod.orm.config).toBe(config)
  })
  it ('检查table设定： 得到设定参数值', () => {
    const value = 'table-name'
    mod.orm.table(value)
    expect(mod.orm.params.tableName).toBe(value)
  })
  it('检查checkConfig，给定正确的参数， 通过', () => {
    const data = {
      accessKeyId: 'xxx',
      secretAccessKey: 'xxx',
      endpoint: 'xxx',
      instancename: 'xxxx'
    }
    expect(mod.checkConfig(data)).toBe(true)
  })
  it('检查checkConfig，给定错误的参数， 报异常', () => {
    const data = {
      accessKeyId: 'xxx',
      endpoint: 'xxx',
      instancename: 'xxxx'
    }
    expect(() => {
      mod.checkConfig(data)
    }).toThrow()
  })
})

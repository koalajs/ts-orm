const mod = require('./index')

describe('ts-orm unit test', () => {
  it('检查config配置: 是否正确', () => {
    expect(typeof(mod.isNilOrEmpty({}))).toBeTruthy()
  })
  it('检查config配置: 缺少参数则抛出异常', () => {
    expect(() => {
      mod.checkConfig({})
    }).toThrow('config配置是必须的,需要执行.init')
  })
  it('检查config配置: 如果数据格式正常，则返回 True', () => {
    const config = {
      accessKeyId: 'xx',
      secretAccessKey: 'xx',
      endpoint: 'xx',
      instancename: 'xxx'
    }
    expect(mod.checkConfig(config)).toBeTruthy()
  })
  it('检查config配置: 如果没有对应的数据，则抛出异常', () => {
    const config = {
      accessKeyId: 'xx',
      secretAccessKey: 'xx',
      instancename: 'xxx'
    }
    expect(() => {
      mod.checkConfig(config)
    }).toThrow('config配置项错误， 必须包含： accessKeyId， secretAccessKey， endpoint， instancename')
  })
  it('检查tableName配置: 缺少参数则抛出异常', () => {
    expect(mod.checkParamTableName).toThrow('table配置是必须，需要执行.table')
  })
  it('检查tableName配置: 必须是一个字符串， 否则异常', () => {
    const data = {
      params: {
        tableName: 123
      }
    }
    expect(() => {
      mod.checkParamTableName(data)
    }).toThrow('table配置必须是一个字符串')
  })
  it('检查tableName配置: 给定正确参数，返回True', () => {
    const data = {
      params: {
        tableName: 'xxxx'
      }
    }
    expect(() => {
      mod.checkParamTableName(data)
    }).toBeTruthy()
  })
  it('检查primaryKey配置: 缺少参数则抛出异常', () => {
    expect(mod.checkParamKey).toThrow('keys配置是必须，需要执行.table')
  })
  it('检查primaryKey配置: 是否是Object格式，错误则报异常', () => {
    const data = {
      params: {
        primaryKey: '123'
      }
    }
    expect(() => {
      mod.checkParamKey(data)
    }).toThrow('keys配置必须是一个Object')
  })
  it('检查checkParamStart', () => {
    expect(mod.checkParamStartKeys).toThrow()
  })
  it('测试', () => {
    const fun = () => 'hello world'
    expect(mod.test()).toBe('hello world')
    expect(fun()).toBe('hello world')
  })
})

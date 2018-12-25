const mod = require('./index')

describe('ts-orm unit test', () => {
  it('检查config配置: 是否正确', () => {
    expect(typeof(mod.isNilOrEmpty({}))).toBeTruthy()
  })
  it('检查config配置: 如果没有，则抛出异常', () => {
    expect(mod.checkConfig).toThrow('config配置是必须的, 需要执行.init')
  })
  it('检查tableName配置: 是否正确: 则抛出异常', () => {
    expect(mod.checkParamTableName).toThrow('table配置是必须， 需要执行.table')
  })
  it('检查primaryKey配置: 是否正确: 则抛出异常', () => {
    expect(mod.checkParamKey).toThrow('keys配置是必须， 需要执行.table')
  })
})

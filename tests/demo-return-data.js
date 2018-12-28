const returnData = {
  consumed: {
    capacity_unit: {
      read: 1,
      write: 0
    }
  },
  rows: [
    {
      primaryKey: [
        {
          name: 'k',
          value: 'up'
        },
        {
          name: 'id',
          value: '12345'
        }
      ],
      attributes: [
        {
          columnName: 'A',
          columnValue: 'a1',
          timestamp: 1545295442675
        },
        {
          columnName: 'B',
          columnValue: 'b123',
          timestamp: 1545295442675
        }
      ]
    },
    {
      primaryKey: [
        {
          name: 'k',
          value: 'up'
        },
        {
          name: 'id',
          value: '54321'
        }
      ],
      attributes: [
        {
          columnName: 'A',
          columnValue: 'aaa',
          timestamp: 1544428459337
        },
        {
          columnName: 'B',
          columnValue: 'bbb',
          timestamp: 1544428459337
        }
      ]
    }
  ],
  next_start_primary_key: null,
  next_token: null,
  data_block_type: 0,
  compress_type: 0,
  RequestId: 'xxxxxxxxx'
}

const formatData = {
  consumed: {
    capacity_unit: {
      read: 1,
      write: 0
    }
  },
  rows: [
    {
      k: 'up',
      id: '12345',
      A: 'a1',
      B: 'b123'
    },
    {
      k: 'up',
      id: '54321',
      A: 'aaa',
      B: 'bbb'
    }
  ],
  next_start_primary_key: null,
  next_token: null,
  data_block_type: 0,
  compress_type: 0,
  RequestId: 'xxxxxxxxx'
}

module.exports = {
  returnData,
  formatData
}

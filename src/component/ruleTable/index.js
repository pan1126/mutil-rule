import React from 'react';
import { Table, Tag, Space } from 'antd';
import './index.scss'


class EditableTable extends React.Component {
  //构造方法
  static defaultProps ={
     
  }
  constructor(props){
      super(props);
      this.state = {
        data :[
          {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
          },
          {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
          },
          {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
          },
        ],
        columns :[
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <p>{text}</p>,
          },
          {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
          },
          {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
          },
          {
            title: 'Tags',
            key: 'tags',
            dataIndex: 'tags',
            render: tags => (
              <>
                {tags.map(tag => {
                  let color = tag.length > 5 ? 'geekblue' : 'green';
                  if (tag === 'loser') {
                    color = 'volcano';
                  }
                  return (
                    <Tag color={color} key={tag}>
                      {tag.toUpperCase()}
                    </Tag>
                  );
                })}
              </>
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
              <Space size="middle">
                <p>Invite {record.name}</p>
                <p>Delete</p>
              </Space>
            ),
          },
        ]
      }
  }


  render(){
      let { columns,data} = this.state
      return (
        <Table columns={columns} dataSource={data} />
      );
  }

}

export default EditableTable;

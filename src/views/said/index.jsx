// redux 将 UI 层分为容器组件和展示组件，容器组件处理数据，展示组件负责展现数据，改动 UI 的时候只会影响到展示组件
import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { add, loadSaidLists } from '../../ducks/said'

var id = 2;

class Index extends Component {
  constructor(props) {
    super(props);
    this.addData();
    this.props.dispatch(loadSaidLists());
  }
  addData = () => {
    // 从 view 触发 store 事件
    this.props.dispatch(add({
      key: id++,
      name: '测试名称',
      context: `测试正文 - ${Date.now()}`
    }));
    console.log('UI.addData', this.props);
  }
  render() {
    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    }, {
      title: '文本',
      dataIndex: 'context',
      key: 'context'
    }];
    return (
      <div>
        <Table
          // bordered
          title={() => <Button className="editable-add-btn" onClick={this.addData}>添加测试</Button>}
          columns={columns}
          // 这个 articles 是 redux 传过来的
          dataSource={this.props.articles}
          onChange={this.handleChange} />
      </div>
    );
  }
}

export default Index;
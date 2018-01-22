/// <reference path="../../../node_modules/@types/codemirror/searchcursor.d.ts" />

import * as React from 'react'
import * as ReactCodeMirror from 'react-codemirror'
import * as CodeMirror from 'CodeMirror'
import * as s from './said-editor.styl'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/solarized.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/search/searchcursor'
import { Button } from 'antd'



interface StateProps {
  onChange: (text: string) => void,
  value?: string
}

export default class extends React.Component<StateProps, {}> {
  constructor(props: StateProps) {
    super(props)
  }

  value = ''

  onChange(value: string) {
    this.value = value
    this.props.onChange(value)
  }

  get now() {
    return Date.now()
  }

  get codeMirror(): CodeMirror.Editor {
    return (this.refs.codeMirror as ReactCodeMirror.ReactCodeMirror).getCodeMirror()
  }

  getText() {
    console.log(this.value)
    return this.value
  }

  inserTextInNewLine(
    instance: CodeMirror.Editor,
    position: { left: number, top: number },
    text: string) {
    const doc = instance.getDoc()

    // cursor 获取的是光标最后一次的位置，拖拽的时候不会改变光标的位置，所以要使用 coordsChar 来计算光标位置
    // const cursor = doc.getCursor()
    const cursor = instance.coordsChar(position)
    /**
     * 如果前面有字符（或空字符），则插入一行，且将内容插入到新行里（共两行）
     * 如果前面没有字符（或空字符），将内容直接插入到本行
     * 思考后决定不实现，不要随便改变用户的输入
     */
    // let isNewLine = false
    // console.log(doc.getRange(
    //   {
    //     line: cursor.line,
    //     ch: 0,
    //   },
    //   {
    //     line: cursor.line,
    //     ch: cursor.ch,
    //   }))
    // const line = doc.getLine(cursor.line)
    doc.replaceRange(text, cursor)
    // 把光标定位到拖拽点
    doc.setCursor({
      line: cursor.line,
      ch: cursor.ch + text.length,
    })
    // 后面可以使用 doc.getAllMarks() 获取标记符号
    // doc.setBookmark() 删除标记
    // return doc.markText(cursor, doc.getCursor())
  }

  componentDidMount() {
    this.codeMirror.on('drop', (instance: CodeMirror.Editor, e: DragEvent) => {
      const markText = `![uploding](${this.now})`
      this.inserTextInNewLine(
        instance, {
          left: e.x,
          top: e.y,
        },
        markText)
      setTimeout(() => { instance.focus() }, 0)

      setTimeout(() => {
        const doc = instance.getDoc()
        const lastLine = doc.lastLine()
        // 找到标记数据
        const searchResult = doc.getSearchCursor(markText)
        // 进行一次查找
        if (searchResult.findNext()) {
          // 替换查到的数据
          searchResult.replace('![图片名称](上传成功!!)')
        }
        // tslint:disable-next-line:align
      }, 1000)
      e.preventDefault()
    })
  }

  render() {
    return (
      <div className={s.saidEditor}>
        <div className={s.saidEditorContent}>
          <ReactCodeMirror
            ref="codeMirror"
            onChange={this.onChange.bind(this)}
            options={{
              mode: 'markdown',
              lineWrapping: true,
              dragDrop: true,
              placeholder: '1. 输入 markdown\n\n2.拖拽上传图片\n\n',
              value: this.props.value,
              // theme: 'solarized light'
            }}
          />
        </div>
        {/* <Button type="primary" onClick={this.getText.bind(this)}>Primary</Button> */}
      </div>
    )
  }
}

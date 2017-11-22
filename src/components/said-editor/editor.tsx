/// <reference path="../../../node_modules/@types/codemirror/searchcursor.d.ts" />

import * as React from 'react'
import * as ReactCodeMirror from 'react-codemirror'
import * as CodeMirror from 'CodeMirror'
import './style.styl'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/solarized.css'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/search/searchcursor'
import { Button } from 'antd'



interface StateProps {
}

export default class extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)
  }

  value = ''

  onChange(value: string) {
    this.value = value
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

  inserTextInNewLine(instance: CodeMirror.Editor, text: string) {
    const doc = instance.getDoc()
    const cursor = doc.getCursor()

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
    doc.replaceRange(text, doc.getCursor())
    // 后面可以使用 doc.getAllMarks() 获取标记符号
    // doc.setBookmark() 删除标记
    // return doc.markText(cursor, doc.getCursor())
  }

  componentDidMount() {
    this.codeMirror.on('drop', (instance: CodeMirror.Editor, e: DragEvent) => {
      const markText = `![uploding](${this.now})`
      this.inserTextInNewLine(instance, markText)
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
      <div className="said-editor">
        <div className="said-editor-content">
          <ReactCodeMirror
            ref="codeMirror"
            onChange={this.onChange.bind(this)}
            options={{
              mode: 'markdown',
              lineWrapping: true,
              dragDrop: true,
              placeholder: '1. 输入 markdown\n\n2.拖拽上传图片\n\n'
              // theme: 'solarized light'
            }}
          />
        </div>
        <Button type="primary" onClick={this.getText.bind(this)}>Primary</Button>
      </div>
    )
  }
}
import * as React from 'react'

import './said-editor.styl'




interface StateProps {
}

export default class extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)
  }

  onParste(e: Event) {
    console.log(e)
    return e.preventDefault()
  }
  // tslint:disable-next-line:no-empty
  onDrop(e: DragEvent) {
    console.dir(this.refs.inputArea)
    console.log()
    console.log(e)
    console.log(e.dataTransfer.files[0])
    return e.preventDefault()
  }
  render() {
    return (
      <div className="said-editor">
        <div className="said-editor-content">
          <textarea
            ref="inputArea"
            placeholder="输入内容"
            className="said-editor-body"
            onPaste={this.onParste.bind(this)}
            onDrop={this.onDrop.bind(this)}
          />
        </div>
      </div>
    )
  }
}
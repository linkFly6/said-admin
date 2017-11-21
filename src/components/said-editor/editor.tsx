import * as React from 'react'
import * as CodeMirror from 'react-codemirror'
import './style.styl'
import 'codemirror/lib/codemirror.css'
// import 'codemirror/theme/solarized.css'
import 'codemirror/mode/markdown/markdown'



interface StateProps {
}

export default class extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)
  }

  render() {
    return (
      <div className="said-editor">
        <div className="said-editor-content">
          <CodeMirror
            value={'默认内容'}
            options={{
              mode: 'markdown',
              lineWrapping: true,
              // theme: 'solarized light'
            }}
          />
        </div>
      </div>
    )
  }
}
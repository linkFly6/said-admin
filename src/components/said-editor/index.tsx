import * as React from 'react'
import './said-editor.styl'
// import Editor from 'draft-js-plugins-editor'
import { Editor, EditorState, ContentState, DraftHandleValue, SelectionState, Modifier } from 'draft-js'
import 'draft-js/dist/Draft.css'

interface StateProps {
  editorState: EditorState
}

export default class extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)
    // this.state = { editorState: EditorState.createEmpty() }
    this.state = { editorState: EditorState.createWithContent(ContentState.createFromText(`\`\`\`ts
    import Action from "./action";
    export const MY_ACTION = "MY_ACTION";
    export type MY_ACTION = { foo: number, message: string }
    
    export function doMyAction(message: string): Action<MY_ACTION> {
        return {
            type: MY_ACTION,
            payload: {
                foo: 123,
                message
            }
        }
    }
    \`\`\``)) }
    this.onChange = (editorState: EditorState) => {
      // 获取编辑器文本
      // console.log(editorState.getCurrentContent().getPlainText())
      console.log(editorState.getCurrentContent())
      this.setState({ editorState })
    }

    this.onParsted = (blobs: Array<Blob>): DraftHandleValue => {
      // 获取光标的 key
      const selection = this.state.editorState.getSelection()
      const focusKey = selection.getFocusKey()
      const currentContent = this.state.editorState.getCurrentContent()
      const entityKey = currentContent.createEntity(
        'LINKPHOTO', 
        'IMMUTABLE',
        { replaceTarget: '插入的文本' })
      // this.state.editorState.getSelection().set(focusKey)
      const modifiedContent = Modifier.replaceText(currentContent, selection, '插入的值', void 0, entityKey as any)
      const newState = EditorState.push(
        this.state.editorState, modifiedContent, this.state.editorState.getLastChangeType())
      this.setState({
        editorState: newState
      })
      return 'handled'
    }
  }
  // tslint:disable-next-line:no-empty
  onChange(editorState: EditorState) { }

  onParsted(blobs: Array<Blob>): DraftHandleValue {
    // this.state.editorState.getCurrentContent()
    return 'not-handled'
  }

  onDropped (selection: SelectionState, files: Array<Blob>): DraftHandleValue {
    console.log(selection)
    return 'not-handled'
  }
  render() {
    return (
      <div className="said-editor">
        <div className="said-editor-content">
          <Editor 
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="输入内容"
            handlePastedFiles={this.onParsted}
            handleDroppedFiles={this.onDropped}
          />
        </div>
      </div>
    )
  }
}
import * as React from 'react'
import './said-editor.styl'
// import Editor from 'draft-js-plugins-editor'
import {
  Editor, EditorState, ContentState, DraftHandleValue, SelectionState, Modifier,
  AtomicBlockUtils, genKey, ContentBlock
} from 'draft-js'
// import { inserBlock } from '../../../assets/js/editor'
import 'draft-js/dist/Draft.css'

interface StateProps {
  editorState: EditorState
}

export default class extends React.Component<{}, StateProps> {
  constructor(props: {}) {
    super(props)
    // this.state = { editorState: EditorState.createEmpty() }
    this.state = {
      editorState: EditorState.createWithContent(ContentState.createFromText(`\`\`\`ts
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
    \`\`\``))
    }
  }
  // tslint:disable-next-line:no-empty
  onChange(editorState: EditorState) {
    // 获取编辑器文本
    // console.log(editorState.getCurrentContent().getPlainText())
    console.log(editorState.getCurrentContent())
    this.setState({ editorState })
  }

  onParsted(blobs: Array<Blob>): DraftHandleValue {
    const createKey = this.insertText(
      this.state.editorState.getSelection(), 'onParsted 文本', { replaceTarget: 'onParsted - meta 信息' })
    return 'handled'
  }

  onDropped(selection: SelectionState, files: Array<Blob>): DraftHandleValue {
    const createKey = this.insertText(selection, 'onDropped 文本', { replaceTarget: 'onDropped - meta 信息' })
    return 'handled'
  }

  insertText(selection: SelectionState, text: string, meta: object) {
    // const focusKey = selection.getFocusKey()
    const currentContent = this.state.editorState.getCurrentContent()
    const entity = currentContent.createEntity(
      'LINKPHOTO',
      'IMMUTABLE',
      meta)
    const createKey = currentContent.getLastCreatedEntityKey()


    let updatedSelection = selection.merge({
      focusOffset: selection.get('focusOffset') + text.length,
    }) as SelectionState
    
    const modifiedContent = Modifier.replaceText(currentContent, selection, text, void 0, createKey)

    let newState = EditorState.push(
      this.state.editorState, modifiedContent, this.state.editorState.getLastChangeType())

    newState = EditorState.forceSelection(newState, updatedSelection)


    this.setState({
      // editorState: AtomicBlockUtils.insertAtomicBlock(newState, createKey, text)
      editorState: newState
    })
    setTimeout(() => { (this.refs.editor as Editor).focus() }, 100)
    return createKey
  }
  render() {
    return (
      <div className="said-editor">
        <div className="said-editor-content">
          <Editor
            ref="editor"
            stripPastedStyles={true}
            editorState={this.state.editorState}
            onChange={this.onChange.bind(this)}
            placeholder="输入内容"
            handlePastedFiles={this.onParsted.bind(this)}
            handleDroppedFiles={this.onDropped.bind(this)}
          />
        </div>
      </div>
    )
  }
}
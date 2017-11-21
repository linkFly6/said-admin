export const getSelection = (textarea: HTMLTextAreaElement) => {
  return {
    start: textarea.selectionStart,
    end: textarea.selectionEnd,
  }
}
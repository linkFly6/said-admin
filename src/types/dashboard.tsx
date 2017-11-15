export interface LogFileModel {
  type: 'error' | 'info' | 'warning',
  size: number,
  date: number,
}

export class Returns<T> {

  private _success: boolean
  /**
   * 结果是否正确，判断条件为 errorCode 不为 0，但并不检测数据合法性, 强检测数据合法请使用 check()
   */
  public get success(): boolean {
    return this._success
  }

  private _error: Error
  /**
   * 错误对象
   */
  public get error(): Error {
    return this._error
  }

  private _code: number
  /**
   * 错误代码
   */
  public get code(): number {
    return this._code
  }

  private _message: string
  /**
   * 消息
   */
  public get message(): string {
    return this._message
  }

  private _data: T
  /**
   * 数据源
   */
  public get data(): T {
    return this._data
  }
  // 将后端返回的数据结果封装为对象
  constructor(error: any, data: any) {
    if (error) {
      this._success = false
      this._code = error.code
      this._message = error.message
      this._error = error
    } else {
      this._success = true
    }
    this._data = data
  }
  /**
   * 和 success 不同，check() 检查返回正确性(errorCode)之后还会检查数据源是否为空(null\undefined)
   */
  public check(): boolean {
    return this.success && this.data != null
  }
}

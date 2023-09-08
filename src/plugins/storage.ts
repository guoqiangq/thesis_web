/**
 * 存储sessionStorage
 */
const session = {
  set: (name:string, value:any) => {
    let n = name;
    let v = value
    if (value) {
      if (typeof value === "object") {
        v = JSON.stringify(value)
      }
    }
    console.log('本地storage存储', n , v )
    sessionStorage.setItem(n, v)
  },
  get: (name:string) => {
    let v:any = sessionStorage.getItem(name)
    try {
      return JSON.parse(v)
    } catch (e) {
      return v
    }
  },
  remove:(name:string) => {
    if (!name) return
    sessionStorage.removeItem(name)
  },
  clear: () => {
    sessionStorage.clear()
    window.localStorage.clear()
  },
  setLocal: (name:string, value:any) => {
    if (!name) return
    if (typeof value !== 'string') {
      value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
  },
  getLocal:(name:string) => {
    if (!name) return
    let v:any = window.localStorage.getItem(name)
    try {
      return JSON.parse(v)
    } catch (e) {
      return v
    }
  },
  removeLocal:(name:string) => {
    if (!name) return
    window.localStorage.removeItem(name)
  }
}

/**
 * 存储localStorage
 */


export default session
const _window = window as any
_window.session = { session };
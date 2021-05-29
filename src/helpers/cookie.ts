const cookie = {
  // 读取 cookie
  read(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${name})=([^;]*)`))
    return match ? match[3] : null
  }
}

export default cookie

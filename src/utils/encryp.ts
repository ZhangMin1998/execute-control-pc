import { obtainKey } from './index'
import CryptoJS from 'crypto-js'
// 加密
export function enByDES(message: string, key?: string) {
  // key 存在 则保存本地key 并加密 
  if (!key) {
    key = deByDES(localStorage.getItem('PrivateKey'), obtainKey())
  }
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.ciphertext.toString()
}

// 解密
export function deByDES(ciphertext: string | null, key: string) {
  const keyHex = CryptoJS.enc.Utf8.parse(key)
  const decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  )
  return decrypted.toString(CryptoJS.enc.Utf8)
}

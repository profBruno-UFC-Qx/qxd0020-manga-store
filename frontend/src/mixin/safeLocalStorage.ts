import Crypto from 'crypto-js'

export class SafeLocalStorageService {
    private storage: Storage
    readonly encryptionToken: string

    constructor(storage: Storage, encryptionToken: string) {
        this.storage = storage
        this.encryptionToken = encryptionToken
    }

    getItem(key: string) {
        const encryptedItem = this.storage.getItem(key)
        if(encryptedItem) {
            try {
                const bytes = Crypto.AES.decrypt(encryptedItem, this.encryptionToken)
                return bytes.toString(Crypto.enc.Utf8)
              } catch (e) {
                this.removeItem(key);
              }
        }
        return ""
    }

    setItem(key: string, item: string) {
        const encryptedItem = Crypto.AES.encrypt(item, this.encryptionToken).toString();
        this.storage.setItem(key, encryptedItem);
    }

    removeItem(key: string) {
        this.storage.removeItem(key)
    }

    clear() {
        this.storage.clear()
    }
}
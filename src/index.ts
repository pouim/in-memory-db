export interface StorageEngine<T> {
  setItem(key: string, value: T): Promise<void>;
  getItem(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class InMemoryStorage<T> implements StorageEngine<T> {
  private storage: Map<string, T> = new Map();

  async setItem(key: string, value: T): Promise<void> {
    this.storage.set(key, value);
  }

  async getItem(key: string): Promise<T | null> {
    return this.storage.get(key) || null;
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}

export class LocalStorageEngine<T> implements StorageEngine<T> {
  async setItem(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }

  async getItem(key: string): Promise<T | null> {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clear(): Promise<void> {
    localStorage.clear();
  }
}

export class IndexedDBEngine<T> implements StorageEngine<T> {
  private dbName: string;
  private storeName: string;

  constructor(dbName: string, storeName: string) {
    this.dbName = dbName;
    this.storeName = storeName;
  }

  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName);

      request.onupgradeneeded = () => {
        const db = request.result;
        db.createObjectStore(this.storeName);
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async setItem(key: string, value: T): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    store.put(value, key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getItem(key: string): Promise<T | null> {
    const db = await this.openDB();
    const transaction = db.transaction(this.storeName, "readonly");
    const store = transaction.objectStore(this.storeName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    store.delete(key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async clear(): Promise<void> {
    const db = await this.openDB();
    const transaction = db.transaction(this.storeName, "readwrite");
    const store = transaction.objectStore(this.storeName);
    store.clear();

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export class UniversalDatabase<T> {
  private storage: StorageEngine<T>;

  constructor(engine: StorageEngine<T>) {
    this.storage = engine;
  }

  async set(key: string, value: T): Promise<void> {
    await this.storage.setItem(key, value);
  }

  async get(key: string): Promise<T | null> {
    return await this.storage.getItem(key);
  }

  async delete(key: string): Promise<void> {
    await this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    await this.storage.clear();
  }
}

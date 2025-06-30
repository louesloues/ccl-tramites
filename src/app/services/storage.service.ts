import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  storageAvailable = !!localStorage && !!localStorage.setItem;
  storage: any = {};
  constructor() {
    if (this.storageAvailable) {
      try {
        localStorage.setItem('testLocalStorage', 'testLocalStorage');
        localStorage.removeItem('testLocalStorage');
      } catch (e) {
        this.storageAvailable = false;
      }
    }
  }
  setItem(key: string, data: string): void {
    this.storageAvailable
      ? localStorage.setItem(key, data)
      : this.storage[key] = data;
  }
  getItem(key: string): string {
    return this.storageAvailable
      ? localStorage.getItem(key)
      : this.storage[key];
  }
  removeItem(key: string): void {
    this.storageAvailable
      ? localStorage.removeItem(key)
      : delete this.storage[key];
  }
  clear() {
    this.storageAvailable
      ? localStorage.clear()
      : this.storage = {};
  }
}

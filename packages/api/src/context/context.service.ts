import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Context {
  private readonly storage = new AsyncLocalStorage<Map<string, any>>();

  set(key: string, value: any): void {
    const store = this.storage.getStore();
    if (store) {
      store.set(key, value);
    }
  }

  get(key: string): any {
    const store = this.storage.getStore();
    return store ? store.get(key) : null;
  }

  run(callback: () => void): void {
    this.storage.run(new Map(), callback);
  }
}

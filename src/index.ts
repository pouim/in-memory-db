export class InMemoryDatabase<T> {
  private data: Map<string, T> = new Map();

  create(id: string, item: T): void {
    this.data.set(id, item);
  }

  read(id: string): T | undefined {
    return this.data.get(id);
  }

  update(id: string, item: T): void {
    if (this.data.has(id)) {
      this.data.set(id, item);
    } else {
      throw new Error("Item not found");
    }
  }

  delete(id: string): void {
    if (!this.data.delete(id)) {
      throw new Error("Item not found");
    }
  }

  query(predicate: (item: T) => boolean): T[] {
    return Array.from(this.data.values()).filter(predicate);
  }
}

// Example usage:
interface User {
  id: string;
  name: string;
  age: number;
}

const userDB = new InMemoryDatabase<User>();
userDB.create("1", { id: "1", name: "Alice", age: 30 });
console.log(userDB.read("1"));

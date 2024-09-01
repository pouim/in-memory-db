import { InMemoryDatabase } from "../src/index";

interface User {
  id: string;
  name: string;
  age: number;
}

describe("InMemoryDatabase", () => {
  let userDB: InMemoryDatabase<User>;

  beforeEach(() => {
    userDB = new InMemoryDatabase<User>();
  });

  it("should create and read a user", () => {
    userDB.create("1", { id: "1", name: "Alice", age: 30 });
    const user = userDB.read("1");
    expect(user).toEqual({ id: "1", name: "Alice", age: 30 });
  });

  // Add more tests for update, delete, query, etc.
});

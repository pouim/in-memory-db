import {
  IndexedDBEngine,
  InMemoryStorage,
  LocalStorageEngine,
  UniversalDatabase,
} from ".";

async function runDemo() {
  console.log("UniversalDatabase Demo:");

  // Example with In-Memory Storage
  console.log("\nUsing InMemoryStorage:");
  const inMemoryDB = new UniversalDatabase(new InMemoryStorage<string>());
  await inMemoryDB.set("key1", "value1");
  console.log("key1:", await inMemoryDB.get("key1"));
  await inMemoryDB.clear();

  // Example with LocalStorage
  console.log("\nUsing LocalStorageEngine:");
  const localStorageDB = new UniversalDatabase(
    new LocalStorageEngine<Record<string, unknown>>()
  );
  await localStorageDB.set("key2", { name: "John Doe", age: 25 });
  console.log("key2:", await localStorageDB.get("key2"));
  await localStorageDB.clear();

  // Example with IndexedDB
  console.log("\nUsing IndexedDBEngine:");
  const indexedDB = new UniversalDatabase(
    new IndexedDBEngine<string>("myDB", "store")
  );
  await indexedDB.set("key3", "value3");
  console.log("key3:", await indexedDB.get("key3"));
  await indexedDB.clear();
}

runDemo().catch((err) => console.error("Error during demo:", err));

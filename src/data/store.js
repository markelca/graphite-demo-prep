// In-memory data store
const store = {
  users: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
  ],
  tasks: []
};

function generateId(collection) {
  const maxId = collection.reduce((max, item) => Math.max(max, item.id), 0);
  return maxId + 1;
}

module.exports = { store, generateId };

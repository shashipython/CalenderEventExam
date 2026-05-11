export default function StudentSelector({
  selectedUserId,
  setSelectedUserId,
  options = [],
}) {

  const defaultUserIds = [1, 2, 3, 4, 5, 15, 9].map((id) => ({
    id,
    label: `User ${id}`,
  }));

  const list = options.length > 0 ? options : defaultUserIds;
  const normalizedList = list.some((item) => item.id === selectedUserId)
    ? list
    : [{ id: selectedUserId, label: `User ${selectedUserId}` }, ...list];

  return (
    <div className="bg-white p-5 rounded-xl shadow-lg mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Select User ID
      </h2>
      <select
        value={selectedUserId}
        onChange={(e) => setSelectedUserId(parseInt(e.target.value, 10))}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {normalizedList.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
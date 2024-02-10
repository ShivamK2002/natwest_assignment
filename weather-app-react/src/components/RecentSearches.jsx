export default function RecentSearches({ recentSearches }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Recent Searches</h2>
      <ul>
        {recentSearches.map((search, index) => (
          <li key={index} className="cursor-pointer">
            {search.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}

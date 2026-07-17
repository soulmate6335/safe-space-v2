import Input from "./Input";

function SearchBar({
  value,
  onChange,
}) {
  return (
    <div className="mb-6">
      <Input
        value={value}
        onChange={onChange}
        placeholder="🔍 Search messages..."
      />
    </div>
  );
}

export default SearchBar;
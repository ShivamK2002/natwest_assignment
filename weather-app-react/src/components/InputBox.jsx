export default function InputBox({ inputRef, unitRef }) {
  return (
    <>
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter Your Location"
        className="text-xl border-b
p-1 border-gray-200 font-semibold uppercase flex-1"
      />
      <select id="unit-switch" ref={unitRef} className="border p-2">
        <option value="metric">Celsius</option>
        <option value="imperial">Fahrenheit</option>
      </select>
    </>
  );
}

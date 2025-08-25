export default function TailwindTest() {
  return (
    <div className="p-4 mb-4 bg-red-500 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold">Tailwind Test</h2>
      <p className="text-sm">If you see a red background with white text, Tailwind is working!</p>
      <div className="mt-2 p-2 bg-blue-600 rounded">
        <span className="text-yellow-300">This should be yellow text on blue background</span>
      </div>
    </div>
  );
}

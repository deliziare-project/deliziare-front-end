type Props = {
  onSubmit: () => void;
  onSkip: () => void;
};

export default function FormActions({ onSubmit, onSkip }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full sm:w-1/2 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
      >
        Submit Profile
      </button>
      <button
        type="button"
        onClick={onSkip}
        className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
      >
        Skip for now
      </button>
    </div>
  );
}

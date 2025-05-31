type Props = {
  onSubmit: (e: React.FormEvent) => void;
  onSkip: () => void;
  isProfileCompleted: boolean;
};

export default function FormActions({ onSubmit, onSkip, isProfileCompleted }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex pt-4 gap-4 ${
        isProfileCompleted ? "justify-center" : "flex-col sm:flex-row"
      }`}
    >
      <button
        type="submit"
        className={`py-3 bg-[#B8755D] text-white font-semibold rounded-md transition ${
          isProfileCompleted ? "w-full sm:w-1/3" : "w-full sm:w-1/2"
        }`}
      >
        Submit Profile
      </button>

      {!isProfileCompleted && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
        >
          Skip
        </button>
      )}
    </form>
  );
}

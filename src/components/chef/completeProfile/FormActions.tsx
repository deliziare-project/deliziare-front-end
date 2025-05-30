type Props = {
  onSkip: () => void;
  isProfileCompleted: boolean;
  isSubmitting?: boolean;
};

export default function FormActions({ 
  onSkip, 
  isProfileCompleted,
  isSubmitting = false 
}: Props) {
  return (
    <div className={`flex pt-4 gap-4 ${
      isProfileCompleted ? "justify-center" : "flex-col sm:flex-row"
    }`}>
      <button
        type="submit" // This is crucial
        disabled={isSubmitting}
        className={`py-3 bg-[#B8755D] text-white font-semibold rounded-md transition ${
          isProfileCompleted ? "w-full sm:w-1/3" : "w-full sm:w-1/2"
        } ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#A56853]"
        }`}
      >
        {isSubmitting ? 'Submitting...' : isProfileCompleted ? 'Update Profile' : 'Submit Profile'}
      </button>

      {!isProfileCompleted && (
        <button
          type="button"
          onClick={onSkip}
          disabled={isSubmitting}
          className="w-full sm:w-1/2 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition disabled:opacity-50"
        >
          Skip
        </button>
      )}
    </div>
  );
}
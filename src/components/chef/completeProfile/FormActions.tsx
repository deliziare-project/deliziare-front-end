type Props = {
  onSubmit: () => void;
  onSkip: () => void;
  isProfileCompleted: boolean;
  isSubmitting: boolean;
  isSkipping: boolean;
  isValid?: boolean;
};

export default function FormActions({
  onSubmit,
  onSkip,
  isProfileCompleted,
  isSubmitting,
  isSkipping,
  isValid = true,
}: Props) {
  return (
    <div
      className={`flex pt-4 gap-4 ${
        isProfileCompleted ? 'justify-center' : 'flex-col sm:flex-row'
      }`}
    >
      <button
        type="submit"
        onClick={onSubmit}
        disabled={isSubmitting || !isValid}
        className={`py-3 bg-[#B8755D] text-white font-semibold rounded-md transition ${
          isProfileCompleted ? 'w-full sm:w-1/3' : 'w-full sm:w-1/2'
        } ${isSubmitting || !isValid ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#A56853]'}`}
      >
        {isSubmitting
          ? 'Submitting...'
          : isProfileCompleted
          ? 'Update Profile'
          : 'Submit Profile'}
      </button>

      <button
        type="button"
        onClick={onSkip}
        disabled={isSkipping}
        className={`py-3 rounded-md transition ${
          isProfileCompleted
            ? 'w-full sm:w-1/3 border border-gray-300 text-gray-700 hover:bg-gray-100'
            : 'w-full sm:w-1/2 border border-gray-300 text-gray-700 hover:bg-gray-100'
        } ${isSkipping ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSkipping
          ? isProfileCompleted
            ? 'Cancelling...'
            : 'Skipping...'
          : isProfileCompleted
          ? 'Cancel'
          : 'Skip'}
      </button>
    </div>
  );
}
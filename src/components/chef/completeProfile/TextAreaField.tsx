type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function TextAreaField({ label, name, value, onChange, placeholder }: Props) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-semibold mb-2 text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );
}

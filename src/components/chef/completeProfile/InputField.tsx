type Props = {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  error?:string;
};

export default function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
}: Props) {
  return (
    <div>
      <label htmlFor={name} className="block text-lg font-semibold mb-2 text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-500"
        placeholder={placeholder}
        min={type === "number" ? 0 : undefined}
        max={type === "number" ? 50 : undefined}
      />
       {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

    </div>
  );
}

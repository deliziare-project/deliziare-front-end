type Props = {
  label: string;
  name: string;
  value: string;
  error?:string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
};

export default function TextAreaField({ label,error, name, value, onChange, placeholder }: Props) {
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
        // className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-500"
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
  );
}

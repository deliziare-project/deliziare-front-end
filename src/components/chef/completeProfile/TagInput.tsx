import { Plus, X } from 'lucide-react';

type Props = {
  label: string;
  inputValue: string;
  setInputValue: (val: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder?: string;
  buttonLabel?: string;
  tagColor?: string;
};

export default function TagInput({
  label,
  inputValue,
  setInputValue,
  tags,
  setTags,
  placeholder,
  buttonLabel = "Add",
  tagColor = "bg-blue-100 text-blue-800"
}: Props) {
  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block text-lg font-semibold mb-2 text-gray-700">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          {buttonLabel === 'Add' ? 'Add' : <Plus size={18} />}
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {tags.map((tag, index) => (
          <span key={index} className={`flex items-center px-3 py-1 ${tagColor} rounded-full text-sm`}>
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="ml-2 hover:text-red-500">
              <X size={16} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

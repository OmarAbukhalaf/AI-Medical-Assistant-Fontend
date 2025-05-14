
import React from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ value, onChange }: TextInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <textarea
        placeholder="Describe your symptoms in detail. For example: 'I have red, itchy patches on my arms that have been present for 2 weeks. They seem to worsen when I'm stressed.'"
        className="min-h-[150px] resize-y text-sm w-full rounded-md border border-gray-300 px-3 py-2"
        value={value}
        onChange={handleChange}
      />
      <p className="text-xs text-gray-500">
        Please provide as much detail as possible about your symptoms, including location, duration, and any factors that make them better or worse.
      </p>
    </div>
  );
};

export default TextInput;

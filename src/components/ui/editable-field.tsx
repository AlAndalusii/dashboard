import { useState, useEffect, useRef } from 'react';

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: 'text' | 'number';
  placeholder?: string;
}

export function EditableField({
  value,
  onChange,
  className = '',
  type = 'text',
  placeholder = 'Edit...',
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      onChange(currentValue);
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      setCurrentValue(value);
    }
  };

  return (
    <div className={`inline-block ${className}`}>
      {isEditing ? (
        <input
          ref={inputRef}
          type={type}
          className="editable-field w-full"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <span
          className="inline-block cursor-pointer hover:bg-white/5 px-2 py-1 rounded"
          onClick={() => setIsEditing(true)}
        >
          {value || <span className="text-gray-400">{placeholder}</span>}
        </span>
      )}
    </div>
  );
} 
import React, { useState, useRef, useEffect } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ id, label, className, labelClassName, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className={labelClassName || "block text-xs font-medium mb-1 text-blue-300"}>{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          className={`w-full border border-gray-600 rounded-md shadow-sm px-3 text-xs sm:text-sm placeholder-gray-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-[42px] ${
            icon ? 'pl-10' : ''
          } ${
            props.readOnly || props.disabled 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-80' 
              : 'bg-gray-900 text-gray-200'
          } ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  labelClassName?: string;
  icon?: React.ReactNode;
}

export const Textarea: React.FC<TextareaProps> = ({ id, label, className, labelClassName, icon, ...props }) => {
  return (
    <div>
      <label htmlFor={id} className={labelClassName || "block text-xs font-medium mb-1 text-blue-300"}>{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute top-3 left-3 flex items-center pointer-events-none text-gray-500">
            {icon}
          </div>
        )}
        <textarea
          id={id}
          className={`w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 text-xs sm:text-sm placeholder-gray-500 placeholder:text-xs sm:placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            icon ? 'pl-10' : ''
          } ${
            props.readOnly || props.disabled 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-80' 
              : 'bg-gray-900 text-gray-200'
          } ${className || ''}`}
          {...props}
        />
      </div>
    </div>
  );
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, label, className, ...props }) => {
  return (
    <div className={`flex items-center ${className || ''}`}>
      <input
        id={id}
        type="checkbox"
        className="h-3.5 w-3.5 rounded border-gray-600 bg-gray-900 focus:ring-blue-500 text-blue-600 flex-shrink-0"
        {...props}
      />
      <label htmlFor={id} className="ml-2 block text-[10px] sm:text-xs text-gray-300 font-medium whitespace-nowrap">{label}</label>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  isLoading = false,
  icon,
  className,
  ...props 
}) => {
  const baseClasses = "font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className || ''}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon}
      {children}
    </button>
  );
};

interface SelectProps {
  id?: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  labelClassName?: string;
}

export const Select: React.FC<SelectProps> = ({ id, label, value, options, onChange, placeholder, labelClassName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);
  const displayLabel = selectedOption?.label || (value ? value : (placeholder || 'Pilih...'));
  const isPlaceholder = !selectedOption && !value;

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={id} className={labelClassName || "block text-sm font-medium mb-1 text-blue-300"}>{label}</label>
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm px-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-default sm:text-sm h-[42px] flex items-center ${isPlaceholder ? 'text-gray-500' : 'text-gray-200'}`}
      >
        <span className="block truncate text-xs sm:text-sm w-full">{displayLabel}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-full bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-700" role="listbox">
          {options.map((option) => (
            <li
              key={option.value}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 ${
                option.value === value ? 'text-white bg-blue-600/20' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              id={`listbox-option-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                <span className={`block truncate ${option.value === value ? 'font-semibold text-blue-400' : 'font-normal'}`}>
                  {option.label}
                </span>
              </div>

              {option.value === value ? (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-500">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
import React from 'react';

const Select = ({ label, name, value, onChange, options, Icon, error, required, disabled, className = '', ...props }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <select
          name={name}
          value={value}
          onChange={onChange} // This will now receive the event object
          disabled={disabled}
          className={`
            appearance-none
            block w-full 
            ${Icon ? 'pl-10' : 'pl-3'} 
            pr-10 py-2 
            border ${error ? 'border-red-300' : 'border-gray-300'}
            rounded-md 
            shadow-sm 
            focus:outline-none 
            focus:ring-2 
            focus:ring-primary 
            focus:border-primary 
            sm:text-sm
            bg-white
            text-gray-900
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="text-gray-900 bg-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
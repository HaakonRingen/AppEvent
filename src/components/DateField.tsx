'use client'
import React from "react";

interface DateFieldProps {
  placeholder: string;
  value: string;
  minDate: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateField: React.FC<DateFieldProps> = ({ placeholder, value, minDate, onChange }) => {
  return (
    <div>
      <label className="block mb-2">{placeholder}</label>
      <input
        type="datetime-local"
        value={value}
        min={minDate}
        onChange={onChange}
        className="block w-full p-2 border rounded"
      />
    </div>
  );
};

export default DateField;
import { useState } from 'react';

export const useForm = <T extends Record<string, any>>(initialValues: T): [T, (key: keyof T) => (value: string) => void] => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (key: keyof T) => (value: string) => {
    setValues({
      ...values,
      [key]: value,
    });
  };

  return [values, handleChange];
};
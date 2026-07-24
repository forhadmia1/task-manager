import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCategories } from '../../../store/slices/taskSlice';
import { CustomDropdown } from '../../../components/CustomDropdown';

interface CategoryDropdownProps {
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  allowAll?: boolean;
}

export function CategoryDropdown({ value, onChange, error, disabled, allowAll }: CategoryDropdownProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.tasks.categories);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const data = categories.map((cat) => ({
    label: cat.name,
    value: cat.id,
  }));

  if (allowAll) {
    data.unshift({ label: 'All Categories', value: 'all' });
  }

  return (
    <CustomDropdown
      label="Category"
      data={data}
      value={value}
      onChange={(item) => onChange(item.value)}
      placeholder="Select a category"
      error={error}
      disabled={disabled}
    />
  );
}

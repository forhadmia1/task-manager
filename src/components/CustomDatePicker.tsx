import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { Calendar } from 'lucide-react-native';

interface CustomDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function CustomDatePicker({
  value,
  onChange,
  label,
  error,
  placeholder = 'Select date',
  disabled = false,
}: CustomDatePickerProps) {
  const [open, setOpen] = useState(false);

  const displayDate = value ? value.toLocaleDateString() : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.input,
          error ? styles.inputError : null,
          disabled ? styles.inputDisabled : null,
        ]}
        onPress={() => setOpen(true)}
        disabled={disabled}
      >
        <Text style={[styles.text, !value && styles.placeholderText]}>
          {displayDate}
        </Text>
        <Calendar color={disabled ? '#9CA3AF' : '#6B7280'} size={20} />
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={value || new Date()}
        mode="date"
        onConfirm={(date) => {
          setOpen(false)
          onChange(date)
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 48,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputDisabled: {
    backgroundColor: '#E5E7EB',
  },
  text: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
});

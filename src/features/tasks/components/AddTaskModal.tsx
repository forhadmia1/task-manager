import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react-native';
import { CategoryDropdown } from './CategoryDropdown';
import { CustomInput } from '../../../components/CustomInput';
import { CustomDatePicker } from '../../../components/CustomDatePicker';
import { useAppDispatch } from '../../../store';
import { createTask } from '../../../store/slices/taskSlice';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  due_date: z.date().refine((date) => date.getTime() >= Date.now(), 'Due date must be in the future'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface AddTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AddTaskModal({ isVisible, onClose }: AddTaskModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch()
  const { control, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      category_id: '',
      due_date: undefined,
    }
  });

  const handleFormSubmit = async (data: TaskFormData) => {

    console.log('Creating task:', data);
    setIsLoading(true);
    try {
      await dispatch(createTask({
        title: data.title,
        description: data.description?.trim() || undefined,
        category_id: data.category_id,
        due_date: data.due_date.toISOString(),
      })).unwrap();
      onClose();
      reset()
    } catch (error: any) {
      console.error('Failed to create task:', error);
      Alert.alert('Task Creation Failed', error?.message || 'Unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Task</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Task Title"
                    placeholder="What needs to be done?"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                    error={errors.title?.message}
                  />
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Description"
                    placeholder="Add details about this task"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                    error={errors.description?.message}
                    multiline
                  />
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="category_id"
                render={({ field: { onChange, value } }) => (
                  <CategoryDropdown
                    value={value}
                    onChange={onChange}
                    error={errors.category_id?.message}
                    disabled={isLoading}
                  />
                )}
              />
            </View>

            <View>
              <Controller
                control={control}
                name="due_date"
                render={({ field: { onChange, value } }) => (
                  <CustomDatePicker
                    label="Due Date"
                    value={value}
                    onChange={onChange}
                    error={errors.due_date?.message}
                    disabled={isLoading}
                    placeholder="Select due date (optional)"
                  />
                )}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#6366F1',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native';
import { CategoryDropdown } from '../components/CategoryDropdown';
import { CustomInput } from '../../../components/CustomInput';
import { CustomDatePicker } from '../../../components/CustomDatePicker';
import { useAppDispatch, useAppSelector } from '../../../store';
import { updateTask } from '../../../store/slices/taskSlice';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Header } from '../../../components/Header';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  due_date: z.date().refine((date) => date.getTime() >= Date.now(), 'Due date must be in the future'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function EditTaskScreen({ route }: any) {
  const { id } = route?.params || {};
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const task = useAppSelector(state => state.tasks.tasks.find(t => t.id === id));

  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      category_id: task?.category_id || '',
      due_date: task?.due_date ? new Date(task.due_date) : undefined,
    }
  });


  const handleFormSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      await dispatch(updateTask({
        id,
        updates: {
          title: data.title,
          description: data.description?.trim() || undefined,
          category_id: data.category_id,
          due_date: data.due_date.toISOString(),
        }
      })).unwrap();
      navigation.goBack();
    } catch (error: any) {
      console.error('Failed to update task:', error);
      Alert.alert('Task Update Failed', error?.message || 'Unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <Header
        title="Edit Task"
        leftIcon={<ArrowLeft color="#111827" size={24} />}
        onPressLeft={() => navigation.goBack()}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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
                <Text style={styles.submitButtonText}>Update Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  form: {
    gap: 16,
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

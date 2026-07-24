import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react-native';
import { CustomInput } from '../../../components/CustomInput';
import { useAppDispatch } from '../../../store';
import { createCategory } from '../../../store/slices/taskSlice';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name is too long'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AddCategoryModal({ isVisible, onClose }: AddCategoryModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    }
  });

  const handleFormSubmit = async (data: CategoryFormData) => {
    setIsLoading(true);
    try {
      await dispatch(createCategory({
        name: data.name.trim(),
      })).unwrap();
      onClose();
      reset();
    } catch (error: any) {
      console.error('Failed to create category:', error);
      Alert.alert('Category Creation Failed', error?.message || 'Unknown error occurred.');
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
            <Text style={styles.title}>Add New Category</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <X color="#6B7280" size={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Category Name"
                  placeholder="e.g. Work, Personal"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={!isLoading}
                  error={errors.name?.message}
                />
              )}
            />

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Category</Text>
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

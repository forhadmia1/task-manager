import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Header } from '../../../components/Header';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchCategories } from '../../../store/slices/taskSlice';
import { Folder, Plus } from 'lucide-react-native';
import { Category } from '../../../store/slices/taskSlice';
import { AddCategoryModal } from '../components/AddCategoryModal';

export function CategoryListScreen() {
  const dispatch = useAppDispatch();
  const { categories, isRefreshing } = useAppSelector((state) => state.tasks);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCategories());
  };

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.categoryCard} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Folder color="#2563EB" size={24} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryDate}>
          Created: {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <Header
        title="Categories"
        rightIcon={<Plus color="#111827" size={24} />}
        onPressRight={() => setIsAddModalVisible(true)}
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No categories found.</Text>
          </View>
        }
      />

      <AddCategoryModal
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  categoryDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
  },
});

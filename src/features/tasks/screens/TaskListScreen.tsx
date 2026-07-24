import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, Text, TextInput } from 'react-native';
import { Header } from '../../../componets/Header';
import { Plus, Search, WifiOff } from 'lucide-react-native';
import { ScreenWrapper } from '../../../componets/ScreenWrapper';
import { TaskCard, Task } from '../components/TaskCard';
import { useAppDispatch, useAppSelector } from '../../../store';
import { fetchTasks } from '../../../store/slices/taskSlice';
import { selectFilteredAndSortedTasks } from '../../../store/selectors/taskSelectors';
import { debounce } from '../../../utils/debounce';

export function TaskListScreen() {
  const dispatch = useAppDispatch();
  const { isRefreshing, isOffline, lastRefreshedAt } = useAppSelector((state) => state.tasks);


  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');


  const filteredTasksSelector = useMemo(
    () => selectFilteredAndSortedTasks(debouncedSearchQuery),
    [debouncedSearchQuery]
  );

  const tasks = useAppSelector(filteredTasksSelector);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchTasks());
  };

  // Debounce search input (300ms)
  const debouncedSearch = useMemo(
    () => debounce((text: string) => {
      setDebouncedSearchQuery(text);
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard
      task={item}
      onPress={(task) => console.log('Navigate to details for task:', task.id)}
    />
  );

  return (
    <ScreenWrapper>
      <Header
        title="My Tasks"
        onPressLeft={() => console.log('Open Drawer')}
        rightIcon={<Plus color="#111827" size={24} />}
        onPressRight={() => console.log('Add Task')}
      />

      <View style={styles.syncStatusContainer}>
        {isOffline && (
          <View style={styles.offlineContainer}>
            <WifiOff size={16} color="#DC2626" />
            <Text style={styles.offlineText}>Offline - Showing cached data</Text>
          </View>
        )}
        {lastRefreshedAt && !isOffline && (
          <Text style={styles.lastRefreshedText}>
            Last updated: {new Date(lastRefreshedAt).toLocaleTimeString()}
          </Text>
        )}
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  syncStatusContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  offlineText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '500',
  },
  lastRefreshedText: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 0,
    paddingHorizontal: 12,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  listContent: {
    padding: 16,
  },
});

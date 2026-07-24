import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, AlertButton } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '../../../components/ScreenWrapper';
import { Header } from '../../../components/Header';
import { ArrowLeft, Edit2, Calendar, Circle, CheckCircle2, Clock, Folder, Hash, Trash2, Star } from 'lucide-react-native';
import { useAppSelector, useAppDispatch } from '../../../store';
import { TaskStatus } from '../components/TaskCard';
import { updateTask, deleteTask, toggleTaskStarred } from '../../../store/slices/taskSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../../../navigation';

export function TaskDetailsScreen({ route }: any) {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const dispatch = useAppDispatch();
  const { id } = route?.params || {};
  const task = useAppSelector(state => state.tasks.tasks.find(t => t.id === id));
  const category = useAppSelector(state => state.tasks.categories.find(c => c.id === task?.category_id));

  if (!task) {
    return (
      <ScreenWrapper>
        <Header
          title="Task Details"
          leftIcon={<ArrowLeft color="#111827" size={24} />}
          onPressLeft={() => navigation.goBack()}
        />
        <View style={styles.center}>
          <Text style={styles.errorText}>Task not found</Text>
        </View>
      </ScreenWrapper>
    );
  }

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'complete': return <CheckCircle2 color="#10B981" size={24} />;
      case 'inprogress': return <Clock color="#3B82F6" size={24} />;
      default: return <Circle color="#9CA3AF" size={24} />;
    }
  };

  const getStatusText = (status: TaskStatus) => {
    switch (status) {
      case 'complete': return 'Completed';
      case 'inprogress': return 'In Progress';
      default: return 'Pending';
    }
  };

  //update status handler
  const handleUpdateStatus = () => {
    const buttons: AlertButton[] = [];
    if (task.status !== 'pending') buttons.push({ text: 'Pending', onPress: () => dispatch(updateTask({ id, updates: { status: 'pending' } })) });
    if (task.status !== 'inprogress') buttons.push({ text: 'In Progress', onPress: () => dispatch(updateTask({ id, updates: { status: 'inprogress' } })) });
    if (task.status !== 'complete') buttons.push({ text: 'Completed', onPress: () => dispatch(updateTask({ id, updates: { status: 'complete' } })) });
    buttons.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Update Status', 'Select a new status for this task', buttons);
  };


  //task delete handler
  const handleDeleteTask = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteTask(id)).unwrap();
              navigation.goBack();
            } catch (error: any) {
              Alert.alert('Error', error?.message || 'Failed to delete task');
            }
          }
        }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <Header
        title="Task Details"
        leftIcon={<ArrowLeft color="#111827" size={24} />}
        onPressLeft={() => navigation.goBack()}
        rightIcon={<Edit2 color="#111827" size={20} />}
        onPressRight={() => navigation.navigate('EditTask', { id })}
      />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => dispatch(toggleTaskStarred(task.id))}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{ marginRight: 12 }}
          >
            <Star
              color={task.starred ? "#F59E0B" : "#D1D5DB"}
              fill={task.starred ? "#F59E0B" : "transparent"}
              size={28}
            />
          </TouchableOpacity>
          <Text style={[styles.title, { flex: 1 }]} numberOfLines={2}>{task.title}</Text>
        </View>

        <TouchableOpacity style={styles.statusRow} onPress={handleUpdateStatus} activeOpacity={0.7}>
          {getStatusIcon(task.status)}
          <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
        </TouchableOpacity>

        {category && (
          <View style={styles.infoRow}>
            <Folder color="#6B7280" size={20} />
            <Text style={styles.infoText}>{category.name}</Text>
          </View>
        )}

        {task.due_date && (
          <View style={styles.infoRow}>
            <Calendar color="#6B7280" size={20} />
            <Text style={styles.infoText}>Due: {new Date(task.due_date).toLocaleDateString()}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Clock color="#6B7280" size={20} />
          <Text style={styles.infoText}>Created: {new Date(task.created_at).toLocaleDateString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Hash color="#6B7280" size={20} />
          <Text style={[styles.infoText, { fontSize: 12 }]} numberOfLines={1} ellipsizeMode="middle">ID: {task.id}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={[styles.description, !task.description && styles.emptyDescription]}>
            {task.description || 'No description provided.'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteTask}
          activeOpacity={0.7}
        >
          <Trash2 color="#EF4444" size={20} />
          <Text style={styles.deleteButtonText}>Delete Task</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  content: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#EF4444' },
  headerRow: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  statusText: { fontSize: 16, fontWeight: '500', color: '#374151', marginLeft: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingHorizontal: 4 },
  infoText: { fontSize: 16, color: '#4B5563', marginLeft: 12 },
  emptyDescription: { color: '#9CA3AF', fontStyle: 'italic' },
  descriptionContainer: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  description: { fontSize: 16, color: '#374151', lineHeight: 24 },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginTop: 24,
    marginBottom: 40,
  },
  deleteButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

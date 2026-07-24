import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, CheckCircle2, Circle, Clock, Star } from 'lucide-react-native';

export type TaskStatus = 'open' | 'inprogress' | 'complete';

export interface Task {
  id: string;
  created_at: string;
  title: string;
  description?: string;
  status: TaskStatus;
  due_date?: string;
  category_id?: string;
  starred?: boolean;
}

interface TaskCardProps {
  task: Task;
  onPress?: (task: Task) => void;
  onToggleStar?: (task: Task) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'complete':
      return <CheckCircle2 color="#10B981" size={20} />; // Emerald-500
    case 'inprogress':
      return <Clock color="#3B82F6" size={20} />; // Blue-500
    default:
      return <Circle color="#9CA3AF" size={20} />; // Gray-400
  }
};

const getStatusText = (status: TaskStatus) => {
  switch (status) {
    case 'complete': return 'Completed';
    case 'inprogress': return 'In Progress';
    default: return 'Open';
  }
};

export function TaskCard({ task, onPress, onToggleStar }: TaskCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(task)}
      activeOpacity={0.7}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => onToggleStar?.(task)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginRight: 12 }}
        >
          <Star
            color={task.starred ? "#F59E0B" : "#D1D5DB"}
            fill={task.starred ? "#F59E0B" : "transparent"}
            size={22}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            task.status === 'complete' && styles.titleCompleted
          ]} numberOfLines={1}>
            {task.title}
          </Text>
        </View>
        <View style={styles.statusIcon}>
          {getStatusIcon(task.status)}
        </View>
      </View>

      {task.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {task.description}
        </Text>
      ) : null}

      <View style={styles.footerRow}>
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText}>{getStatusText(task.status)}</Text>
        </View>

        {task.due_date && (
          <View style={styles.dateContainer}>
            <Calendar color="#6B7280" size={14} />
            <Text style={styles.dateText}>
              Due Date: {new Date(task.due_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  statusIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
});

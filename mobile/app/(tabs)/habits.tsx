import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { format } from 'date-fns';
import * as Haptics from 'expo-haptics';
import { subscriptionManager } from '../lib/subscription';
import PremiumGate from '../components/PremiumGate';

export default function HabitsScreen() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState('#10b981');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: habits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
  });

  const createHabitMutation = useMutation({
    mutationFn: api.createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      setShowAddModal(false);
      setNewHabitName('');
      setNewHabitDescription('');
      setSelectedColor('#10b981');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    },
  });

  const toggleHabitMutation = useMutation({
    mutationFn: ({ habitId, date }: { habitId: number; date: string }) =>
      api.toggleHabit(habitId, date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['daily-progress'] });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });

  const handleCreateHabit = async () => {
    if (!newHabitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name.');
      return;
    }

    // Check if user can create more habits
    const maxHabits = await subscriptionManager.getMaxHabitsAllowed();
    const currentHabitsCount = habits?.length || 0;
    
    if (currentHabitsCount >= maxHabits) {
      Alert.alert(
        'Upgrade to Premium',
        'Free users can create up to 3 habits. Upgrade to Premium for unlimited habits!',
        [
          { text: 'Maybe Later', style: 'cancel' },
          { text: 'Upgrade', onPress: () => setShowUpgradeModal(true) }
        ]
      );
      return;
    }

    createHabitMutation.mutate({
      name: newHabitName,
      description: newHabitDescription,
      color: selectedColor,
    });
  };

  const handleToggleHabit = (habitId: number) => {
    toggleHabitMutation.mutate({ habitId, date: today });
  };

  const colorOptions = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', 
    '#ef4444', '#06b6d4', '#84cc16', '#f97316'
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="checkmark-circle-outline" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Daily Habits</Text>
          <Text style={styles.headerSubtitle}>Build healthy routines</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Date */}
        <View style={styles.dateCard}>
          <Text style={styles.dateText}>Today - {format(new Date(), 'MMMM d, yyyy')}</Text>
        </View>

        {/* Habits List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading habits...</Text>
          </View>
        ) : habits && habits.length > 0 ? (
          <View style={styles.habitsContainer}>
            {habits.map((habit: any) => (
              <TouchableOpacity
                key={habit.id}
                style={styles.habitCard}
                onPress={() => handleToggleHabit(habit.id)}
                disabled={toggleHabitMutation.isPending}
              >
                <View style={styles.habitLeft}>
                  <View
                    style={[
                      styles.habitIcon,
                      { backgroundColor: habit.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={habit.completed ? 'checkmark' : 'add'}
                      size={20}
                      color={habit.color}
                    />
                  </View>
                  <View style={styles.habitContent}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    {habit.description && (
                      <Text style={styles.habitDescription}>
                        {habit.description}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.habitRight}>
                  <View
                    style={[
                      styles.checkbox,
                      habit.completed && { backgroundColor: habit.color },
                    ]}
                  >
                    {habit.completed && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptyDescription}>
              Create your first mindful habit to start building healthy routines
            </Text>
          </View>
        )}

        {/* Add Habit Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Habit</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Habit Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Habit</Text>
            <TouchableOpacity
              onPress={handleCreateHabit}
              disabled={!newHabitName.trim() || createHabitMutation.isPending}
            >
              <Text
                style={[
                  styles.saveButton,
                  (!newHabitName.trim() || createHabitMutation.isPending) &&
                    styles.disabledButton,
                ]}
              >
                {createHabitMutation.isPending ? 'Creating...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Habit Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Morning meditation"
                placeholderTextColor="#9ca3af"
                value={newHabitName}
                onChangeText={setNewHabitName}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your habit..."
                placeholderTextColor="#9ca3af"
                value={newHabitDescription}
                onChangeText={setNewHabitDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#dcfce7',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#6b7280',
  },
  habitsContainer: {
    marginTop: 16,
  },
  habitCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  habitLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  habitDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  habitRight: {},
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  addButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 20,
    marginBottom: 20,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
  disabledButton: {
    color: '#9ca3af',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedColor: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
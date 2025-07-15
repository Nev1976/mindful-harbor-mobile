import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import * as Haptics from 'expo-haptics';

export default function ReflectScreen() {
  const [reflectionText, setReflectionText] = useState('');
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: dailyPrompt, isLoading: promptLoading } = useQuery({
    queryKey: ['daily-prompt'],
    queryFn: api.getDailyPrompt,
  });

  const { data: reflections } = useQuery({
    queryKey: ['reflections'],
    queryFn: api.getReflections,
  });

  const createReflectionMutation = useMutation({
    mutationFn: api.createReflection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reflections'] });
      queryClient.invalidateQueries({ queryKey: ['daily-progress'] });
      setReflectionText('');
      setSelectedMood(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Your reflection has been saved!');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to save reflection. Please try again.');
    },
  });

  const handleSubmitReflection = () => {
    if (!reflectionText.trim() || selectedMood === null) {
      Alert.alert('Incomplete', 'Please write your reflection and select a mood.');
      return;
    }

    createReflectionMutation.mutate({
      promptId: dailyPrompt?.id,
      content: reflectionText,
      mood: selectedMood,
    });
  };

  const moodOptions = [
    { value: 1, emoji: '😔', label: 'Very Low' },
    { value: 2, emoji: '🙁', label: 'Low' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😊', label: 'Great' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="bulb-outline" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Daily Reflection</Text>
          <Text style={styles.headerSubtitle}>Take a moment to reflect</Text>
        </View>
      </LinearGradient>

      {/* Today's Prompt */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Today's Prompt</Text>
        {promptLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading prompt...</Text>
          </View>
        ) : (
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{dailyPrompt?.content}</Text>
          </View>
        )}
      </View>

      {/* Reflection Input */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Your Reflection</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Share your thoughts and feelings..."
          placeholderTextColor="#9ca3af"
          value={reflectionText}
          onChangeText={setReflectionText}
          textAlignVertical="top"
        />

        {/* Mood Selection */}
        <Text style={styles.moodTitle}>How are you feeling?</Text>
        <View style={styles.moodContainer}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodOption,
                selectedMood === mood.value && styles.selectedMood,
              ]}
              onPress={() => {
                setSelectedMood(mood.value);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!reflectionText.trim() || selectedMood === null) && styles.disabledButton,
          ]}
          onPress={handleSubmitReflection}
          disabled={!reflectionText.trim() || selectedMood === null || createReflectionMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {createReflectionMutation.isPending ? 'Saving...' : 'Save Reflection'}
          </Text>
          <Ionicons name="checkmark" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Previous Reflections */}
      {reflections && reflections.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Reflections</Text>
          {reflections.slice(0, 3).map((reflection: any, index: number) => (
            <View key={index} style={styles.reflectionItem}>
              <View style={styles.reflectionHeader}>
                <Text style={styles.reflectionDate}>
                  {new Date(reflection.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.reflectionMood}>
                  {moodOptions.find(m => m.value === reflection.mood)?.emoji}
                </Text>
              </View>
              <Text style={styles.reflectionContent} numberOfLines={3}>
                {reflection.content}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
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
    color: '#e9d5ff',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#6b7280',
  },
  promptContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 16,
  },
  promptText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#fff',
    minHeight: 120,
  },
  moodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 12,
  },
  moodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    flex: 1,
    marginHorizontal: 2,
  },
  selectedMood: {
    borderColor: '#8b5cf6',
    backgroundColor: '#f3f4f6',
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reflectionItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reflectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reflectionDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  reflectionMood: {
    fontSize: 20,
  },
  reflectionContent: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});
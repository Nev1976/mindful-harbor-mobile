import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { data: dailyPrompt, isLoading: promptLoading } = useQuery({
    queryKey: ['daily-prompt'],
    queryFn: api.getDailyPrompt,
  });

  const { data: microMoments, isLoading: momentsLoading } = useQuery({
    queryKey: ['micro-moments'],
    queryFn: api.getMicroMoments,
  });

  const { data: progress } = useQuery({
    queryKey: ['daily-progress'],
    queryFn: api.getDailyProgress,
  });

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>{getTimeOfDay()}</Text>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
        </View>
      </LinearGradient>

      {/* Daily Progress Summary */}
      {progress && (
        <View style={styles.progressCard}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progress.habitsCompleted}</Text>
              <Text style={styles.progressLabel}>Habits</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progress.microMomentsCompleted}</Text>
              <Text style={styles.progressLabel}>Moments</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>{progress.mindfulnessMinutes}</Text>
              <Text style={styles.progressLabel}>Minutes</Text>
            </View>
          </View>
        </View>
      )}

      {/* Daily Prompt */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Daily Reflection</Text>
        {promptLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading today's prompt...</Text>
          </View>
        ) : (
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>{dailyPrompt?.content}</Text>
            <TouchableOpacity style={styles.reflectButton}>
              <Text style={styles.reflectButtonText}>Reflect Now</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Micro Moments */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Mindful Moments</Text>
        {momentsLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading activities...</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.momentsContainer}>
              {microMoments?.slice(0, 3).map((moment: any, index: number) => (
                <TouchableOpacity key={index} style={styles.momentCard}>
                  <View style={styles.momentIcon}>
                    <Ionicons name="leaf-outline" size={24} color="#10b981" />
                  </View>
                  <Text style={styles.momentTitle}>{moment.title}</Text>
                  <Text style={styles.momentDuration}>{moment.duration}s</Text>
                  <Text style={styles.momentDescription} numberOfLines={2}>
                    {moment.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
            <Text style={styles.actionText}>Log Habits</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="trending-up-outline" size={24} color="#f59e0b" />
            <Text style={styles.actionText}>View Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="heart-outline" size={24} color="#ef4444" />
            <Text style={styles.actionText}>Mood Check</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="book-outline" size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>Journal</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#dcfce7',
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
  progressCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
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
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10b981',
  },
  progressLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    color: '#6b7280',
  },
  promptContainer: {
    alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 16,
  },
  reflectButton: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  reflectButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  momentsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 16,
  },
  momentCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    width: width * 0.6,
    alignItems: 'center',
  },
  momentIcon: {
    backgroundColor: '#dcfce7',
    borderRadius: 20,
    padding: 12,
    marginBottom: 8,
  },
  momentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  momentDuration: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
    marginBottom: 8,
  },
  momentDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
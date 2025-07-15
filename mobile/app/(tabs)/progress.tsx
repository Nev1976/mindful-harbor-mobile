import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function ProgressScreen() {
  const { data: dailyProgress } = useQuery({
    queryKey: ['daily-progress'],
    queryFn: api.getDailyProgress,
  });

  const { data: habits } = useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
  });

  const { data: reflections } = useQuery({
    queryKey: ['reflections'],
    queryFn: api.getReflections,
  });

  // Calculate progress percentages
  const habitProgress = dailyProgress 
    ? (dailyProgress.habitsCompleted / Math.max(dailyProgress.totalHabits, 1)) * 100
    : 0;

  const weeklyStreak = 5; // Mock data - would come from backend
  const totalMindfulnessMinutes = dailyProgress?.mindfulnessMinutes || 0;

  // Progress circle component
  const ProgressCircle = ({ 
    percentage, 
    size = 120, 
    strokeWidth = 8, 
    color = '#10b981' 
  }: {
    percentage: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={[styles.progressCircle, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.progressText}>
          <Text style={[styles.progressPercentage, { color }]}>
            {Math.round(percentage)}%
          </Text>
        </View>
      </View>
    );
  };

  const getWeekDays = () => {
    const start = startOfWeek(new Date());
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons name="trending-up-outline" size={32} color="#fff" />
          <Text style={styles.headerTitle}>Your Progress</Text>
          <Text style={styles.headerSubtitle}>Track your mindful journey</Text>
        </View>
      </LinearGradient>

      {/* Today's Overview */}
      <View style={styles.overviewCard}>
        <Text style={styles.sectionTitle}>Today's Progress</Text>
        <View style={styles.progressContainer}>
          <ProgressCircle percentage={habitProgress} color="#10b981" />
          <View style={styles.todayStats}>
            <View style={styles.statItem}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              <Text style={styles.statNumber}>
                {dailyProgress?.habitsCompleted || 0}
              </Text>
              <Text style={styles.statLabel}>Habits Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={24} color="#3b82f6" />
              <Text style={styles.statNumber}>{totalMindfulnessMinutes}</Text>
              <Text style={styles.statLabel}>Mindful Minutes</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bulb" size={24} color="#8b5cf6" />
              <Text style={styles.statNumber}>
                {dailyProgress?.reflectionCompleted ? 1 : 0}
              </Text>
              <Text style={styles.statLabel}>Reflections</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Weekly View */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>This Week</Text>
        <View style={styles.weekGrid}>
          {getWeekDays().map((date, index) => {
            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
            const completion = Math.random() > 0.3; // Mock data
            
            return (
              <View key={index} style={styles.dayCard}>
                <Text style={[styles.dayLabel, isToday && styles.todayLabel]}>
                  {format(date, 'EEE')}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
                  {format(date, 'd')}
                </Text>
                <View style={[
                  styles.dayIndicator,
                  completion && styles.completedDay,
                  isToday && styles.todayIndicator,
                ]} />
              </View>
            );
          })}
        </View>
      </View>

      {/* Streaks */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Streaks & Achievements</Text>
        <View style={styles.streakContainer}>
          <View style={styles.streakItem}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.streakIcon}
            >
              <Ionicons name="flame" size={24} color="#fff" />
            </LinearGradient>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{weeklyStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
          
          <View style={styles.streakItem}>
            <LinearGradient
              colors={['#8b5cf6', '#7c3aed']}
              style={styles.streakIcon}
            >
              <Ionicons name="trophy" size={24} color="#fff" />
            </LinearGradient>
            <View style={styles.streakContent}>
              <Text style={styles.streakNumber}>{reflections?.length || 0}</Text>
              <Text style={styles.streakLabel}>Total Reflections</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Habit Breakdown */}
      {habits && habits.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Habit Breakdown</Text>
          {habits.map((habit: any, index: number) => {
            const completion = Math.random() * 100; // Mock completion percentage
            
            return (
              <View key={index} style={styles.habitProgressItem}>
                <View style={styles.habitInfo}>
                  <View
                    style={[
                      styles.habitColorDot,
                      { backgroundColor: habit.color },
                    ]}
                  />
                  <Text style={styles.habitName}>{habit.name}</Text>
                </View>
                <View style={styles.habitProgressBar}>
                  <View
                    style={[
                      styles.habitProgressFill,
                      { 
                        width: `${completion}%`,
                        backgroundColor: habit.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.habitPercentage}>
                  {Math.round(completion)}%
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Insights */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightItem}>
          <Ionicons name="trending-up" size={20} color="#10b981" />
          <Text style={styles.insightText}>
            You're on a great streak! Keep up the momentum.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Ionicons name="bulb" size={20} color="#f59e0b" />
          <Text style={styles.insightText}>
            Morning is your most productive time for habits.
          </Text>
        </View>
        <View style={styles.insightItem}>
          <Ionicons name="heart" size={20} color="#ef4444" />
          <Text style={styles.insightText}>
            Your mood has improved by 20% this week.
          </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fef3c7',
    marginTop: 4,
  },
  overviewCard: {
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCircle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressPercentage: {
    fontSize: 20,
    fontWeight: '700',
  },
  todayStats: {
    flex: 1,
    marginLeft: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
    marginRight: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  todayLabel: {
    color: '#f59e0b',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  todayNumber: {
    color: '#f59e0b',
  },
  dayIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
  },
  completedDay: {
    backgroundColor: '#10b981',
  },
  todayIndicator: {
    backgroundColor: '#f59e0b',
  },
  streakContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  streakIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  streakLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  habitProgressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 120,
  },
  habitColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  habitName: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  habitProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  habitProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  habitPercentage: {
    fontSize: 12,
    color: '#6b7280',
    width: 40,
    textAlign: 'right',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});
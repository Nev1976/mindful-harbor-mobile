import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PagerView from 'react-native-pager-view';

const { width } = Dimensions.get('window');

interface OnboardingFlowProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 'welcome',
    title: 'Welcome to Mindful Moments',
    subtitle: 'Your journey to mindfulness starts here',
    description: 'Discover daily practices that help you stay present, reduce stress, and build lasting wellness habits.',
    icon: 'leaf-outline',
    color: '#10b981',
  },
  {
    id: 'prompts',
    title: 'Daily Reflection Prompts',
    subtitle: 'Deepen your self-awareness',
    description: 'Each day brings a new thought-provoking question designed to help you reflect on your experiences and emotions.',
    icon: 'bulb-outline',
    color: '#8b5cf6',
  },
  {
    id: 'habits',
    title: 'Track Mindful Habits',
    subtitle: 'Build consistency with gentle reminders',
    description: 'Create personalized habits that align with your wellness goals and watch your streak grow day by day.',
    icon: 'checkmark-circle-outline',
    color: '#f59e0b',
  },
  {
    id: 'moments',
    title: 'Micro Mindful Moments',
    subtitle: 'Mindfulness in just 30 seconds',
    description: 'Quick exercises perfect for busy schedules - take a mindful pause whenever you need it most.',
    icon: 'time-outline',
    color: '#06b6d4',
  },
  {
    id: 'progress',
    title: 'Visualize Your Growth',
    subtitle: 'See your mindfulness journey unfold',
    description: 'Beautiful charts and insights help you understand your patterns and celebrate your progress.',
    icon: 'trending-up-outline',
    color: '#ef4444',
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [pagerRef, setPagerRef] = useState<PagerView | null>(null);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      pagerRef?.setPage(nextStep);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePageChange = (e: any) => {
    setCurrentStep(e.nativeEvent.position);
  };

  const renderStep = (step: typeof onboardingSteps[0], index: number) => (
    <View key={step.id} style={styles.stepContainer}>
      <LinearGradient
        colors={[step.color, step.color + '80']}
        style={styles.iconContainer}
      >
        <Ionicons name={step.icon as any} size={64} color="#fff" />
      </LinearGradient>

      <Text style={styles.stepTitle}>{step.title}</Text>
      <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
      <Text style={styles.stepDescription}>{step.description}</Text>

      {/* Illustration area - you could add custom illustrations here */}
      <View style={styles.illustrationArea}>
        <View style={[styles.illustrationPlaceholder, { backgroundColor: step.color + '20' }]}>
          <Ionicons name={step.icon as any} size={120} color={step.color + '60'} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <PagerView
        ref={setPagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageChange}
      >
        {onboardingSteps.map((step, index) => (
          <View key={step.id} style={styles.page}>
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {renderStep(step, index)}
            </ScrollView>
          </View>
        ))}
      </PagerView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Page Indicators */}
        <View style={styles.indicators}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentStep && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigation}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                const prevStep = currentStep - 1;
                setCurrentStep(prevStep);
                pagerRef?.setPage(prevStep);
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#6b7280" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          )}

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  illustrationArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#8b5cf6',
    width: 24,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
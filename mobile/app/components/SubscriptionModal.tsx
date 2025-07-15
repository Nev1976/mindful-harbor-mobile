import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SUBSCRIPTION_PLANS, subscriptionManager } from '../lib/subscription';
import * as Haptics from 'expo-haptics';

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubscribe?: (planId: string) => void;
}

export default function SubscriptionModal({ 
  visible, 
  onClose, 
  onSubscribe 
}: SubscriptionModalProps) {
  const [selectedPlan, setSelectedPlan] = useState(SUBSCRIPTION_PLANS[1].id); // Default to yearly
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartTrial = async () => {
    try {
      setIsProcessing(true);
      await subscriptionManager.startFreeTrial();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        'Trial Started!',
        'Your 7-day free trial has begun. Enjoy premium features!',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to start trial. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubscribe = async () => {
    if (onSubscribe) {
      onSubscribe(selectedPlan);
    } else {
      // Default implementation - would integrate with App Store
      Alert.alert(
        'Coming Soon',
        'App Store integration will be available in the production version.',
        [{ text: 'OK' }]
      );
    }
  };

  const selectedPlanData = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed']}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Ionicons name="star" size={48} color="#fbbf24" />
          <Text style={styles.headerTitle}>Unlock Premium</Text>
          <Text style={styles.headerSubtitle}>
            Take your mindfulness journey to the next level
          </Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {[
            'Unlimited custom habits',
            'Advanced progress analytics',
            'Premium meditation content',
            'Personalized insights & recommendations',
            'Export your data',
            'Priority customer support',
            'Ad-free experience',
            'Early access to new features'
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          {SUBSCRIPTION_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.selectedPlan,
              ]}
              onPress={() => {
                setSelectedPlan(plan.id);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <Text style={styles.planPrice}>
                    ${plan.price}
                    <Text style={styles.planPeriod}>/{plan.period}</Text>
                  </Text>
                  {plan.period === 'yearly' && (
                    <View style={styles.savingsBadge}>
                      <Text style={styles.savingsText}>Save 40%</Text>
                    </View>
                  )}
                </View>
                <View style={[
                  styles.radioButton,
                  selectedPlan === plan.id && styles.selectedRadio,
                ]}>
                  {selectedPlan === plan.id && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Trial CTA */}
        <View style={styles.trialSection}>
          <TouchableOpacity
            style={styles.trialButton}
            onPress={handleStartTrial}
            disabled={isProcessing}
          >
            <Text style={styles.trialButtonText}>
              {isProcessing ? 'Starting Trial...' : 'Start 7-Day Free Trial'}
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.trialNote}>
            Free for 7 days, then ${selectedPlanData?.price}/{selectedPlanData?.period}
          </Text>
          
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
            disabled={isProcessing}
          >
            <Text style={styles.subscribeButtonText}>
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            Subscription automatically renews unless cancelled at least 24 hours before the end of the current period.
          </Text>
          <View style={styles.termsLinks}>
            <TouchableOpacity>
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> • </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={styles.separator}> • </Text>
            <TouchableOpacity>
              <Text style={styles.linkText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e9d5ff',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  featuresSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
  },
  plansSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  planCard: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  selectedPlan: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8b5cf6',
    marginTop: 4,
  },
  planPeriod: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6b7280',
  },
  savingsBadge: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    backgroundColor: '#8b5cf6',
    borderColor: '#8b5cf6',
  },
  trialSection: {
    padding: 20,
    alignItems: 'center',
  },
  trialButton: {
    backgroundColor: '#10b981',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  trialButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  trialNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  subscribeButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  termsSection: {
    padding: 20,
    paddingTop: 0,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  termsLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 12,
    color: '#8b5cf6',
    textDecorationLine: 'underline',
  },
  separator: {
    fontSize: 12,
    color: '#6b7280',
  },
});
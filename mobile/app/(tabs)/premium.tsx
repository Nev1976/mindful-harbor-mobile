import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { subscriptionManager, UserSubscription } from '../lib/subscription';
import SubscriptionModal from '../components/SubscriptionModal';
import { format } from 'date-fns';

export default function PremiumScreen() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const status = await subscriptionManager.getSubscriptionStatus();
      setSubscription(status);
    } catch (error) {
      console.error('Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your premium subscription? You\'ll lose access to premium features.',
      [
        { text: 'Keep Premium', style: 'cancel' },
        { 
          text: 'Cancel Subscription', 
          style: 'destructive',
          onPress: async () => {
            await subscriptionManager.cancelSubscription();
            loadSubscriptionStatus();
          }
        }
      ]
    );
  };

  const handleRestorePurchases = async () => {
    try {
      await subscriptionManager.restorePurchases();
      await loadSubscriptionStatus();
      Alert.alert('Success', 'Purchases restored successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading subscription status...</Text>
      </View>
    );
  }

  const isPremium = subscription?.isActive || subscription?.isTrialActive;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={isPremium ? ['#10b981', '#059669'] : ['#8b5cf6', '#7c3aed']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Ionicons 
            name={isPremium ? "star" : "star-outline"} 
            size={32} 
            color="#fff" 
          />
          <Text style={styles.headerTitle}>
            {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isPremium 
              ? 'Thank you for supporting Mindful Moments!' 
              : 'Unlock the full potential of mindfulness'
            }
          </Text>
        </View>
      </LinearGradient>

      {/* Current Status */}
      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Current Status</Text>
        
        {isPremium ? (
          <View style={styles.premiumStatus}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#10b981" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Premium Member</Text>
              {subscription?.isTrialActive ? (
                <Text style={styles.statusSubtitle}>
                  Free trial until {subscription.trialExpiresAt && format(new Date(subscription.trialExpiresAt), 'MMM d, yyyy')}
                </Text>
              ) : (
                <Text style={styles.statusSubtitle}>
                  {subscription?.plan?.name} - Renews {subscription?.expiresAt && format(new Date(subscription.expiresAt), 'MMM d, yyyy')}
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.freeStatus}>
            <View style={styles.statusIcon}>
              <Ionicons name="person-circle-outline" size={24} color="#6b7280" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Free User</Text>
              <Text style={styles.statusSubtitle}>
                Limited to 3 habits and basic features
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Premium Features */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Premium Features</Text>
        
        {[
          { icon: 'infinite', title: 'Unlimited Habits', description: 'Create as many habits as you want' },
          { icon: 'analytics', title: 'Advanced Analytics', description: 'Detailed insights and progress tracking' },
          { icon: 'library', title: 'Premium Content', description: 'Exclusive meditations and exercises' },
          { icon: 'bulb', title: 'AI Insights', description: 'Personalized recommendations' },
          { icon: 'download', title: 'Export Data', description: 'Download your progress and reflections' },
          { icon: 'headset', title: 'Priority Support', description: 'Get help when you need it' },
        ].map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <View style={[
              styles.featureIcon,
              { backgroundColor: isPremium ? '#dcfce7' : '#f3f4f6' }
            ]}>
              <Ionicons 
                name={feature.icon as any} 
                size={20} 
                color={isPremium ? '#10b981' : '#6b7280'} 
              />
            </View>
            <View style={styles.featureContent}>
              <Text style={[
                styles.featureTitle,
                { color: isPremium ? '#1f2937' : '#6b7280' }
              ]}>
                {feature.title}
              </Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
            {isPremium && (
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            )}
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsCard}>
        {!isPremium ? (
          <>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => setShowSubscriptionModal(true)}
            >
              <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.restoreButton}
              onPress={handleRestorePurchases}
            >
              <Text style={styles.restoreButtonText}>Restore Purchases</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {subscription?.isTrialActive && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => setShowSubscriptionModal(true)}
              >
                <Text style={styles.upgradeButtonText}>Continue with Premium</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => Alert.alert('Manage Subscription', 'Redirecting to App Store...')}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelSubscription}
            >
              <Text style={styles.cancelButtonText}>Cancel Subscription</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Support */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Need Help?</Text>
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="mail" size={20} color="#8b5cf6" />
          <Text style={styles.supportText}>Contact Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="document-text" size={20} color="#8b5cf6" />
          <Text style={styles.supportText}>Terms of Service</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.supportItem}>
          <Ionicons name="shield-checkmark" size={20} color="#8b5cf6" />
          <Text style={styles.supportText}>Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onSubscribe={(planId) => {
          setShowSubscriptionModal(false);
          loadSubscriptionStatus();
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
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
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textAlign: 'center',
  },
  statusCard: {
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
  premiumStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  actionsCard: {
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
  upgradeButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  restoreButton: {
    borderWidth: 1,
    borderColor: '#8b5cf6',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  restoreButtonText: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
  manageButton: {
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  manageButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
  },
  supportItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  supportText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
});
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { subscriptionManager } from '../lib/subscription';
import SubscriptionModal from './SubscriptionModal';

interface PremiumGateProps {
  children: React.ReactNode;
  feature: string;
  description: string;
  showUpgrade?: boolean;
}

export default function PremiumGate({ 
  children, 
  feature, 
  description,
  showUpgrade = true 
}: PremiumGateProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const premium = await subscriptionManager.isPremiumUser();
      setIsPremium(premium);
    } catch (error) {
      setIsPremium(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Checking access...</Text>
      </View>
    );
  }

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.gateContent}>
        <View style={styles.iconContainer}>
          <Ionicons name="star" size={48} color="#fbbf24" />
        </View>
        
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.feature}>{feature}</Text>
        <Text style={styles.description}>{description}</Text>
        
        {showUpgrade && (
          <TouchableOpacity
            style={styles.upgradeButton}
            onPress={() => setShowSubscription(true)}
          >
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <SubscriptionModal
        visible={showSubscription}
        onClose={() => setShowSubscription(false)}
        onSubscribe={(planId) => {
          // Handle subscription
          setShowSubscription(false);
          checkPremiumStatus(); // Refresh status
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  gateContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    maxWidth: 320,
  },
  iconContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 40,
    padding: 20,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  feature: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
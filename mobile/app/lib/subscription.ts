// Subscription management for premium features
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  priceId: string; // App Store product ID
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'premium_monthly',
    name: 'Premium Monthly',
    price: 9.99,
    period: 'monthly',
    priceId: 'com.mindfulmoments.premium.monthly',
    features: [
      'Unlimited habits',
      'Advanced progress analytics',
      'Premium content library',
      'Personalized insights',
      'Export progress data',
      'Priority support'
    ]
  },
  {
    id: 'premium_yearly',
    name: 'Premium Yearly',
    price: 59.99,
    period: 'yearly',
    priceId: 'com.mindfulmoments.premium.yearly',
    features: [
      'Everything in monthly plan',
      '40% savings',
      'Exclusive yearly content',
      'Early access to new features'
    ]
  }
];

export interface UserSubscription {
  isActive: boolean;
  plan?: SubscriptionPlan;
  expiresAt?: Date;
  purchaseDate?: Date;
  isTrialActive: boolean;
  trialExpiresAt?: Date;
}

class SubscriptionManager {
  private storageKey = '@subscription_status';

  // Check if user has premium access
  async isPremiumUser(): Promise<boolean> {
    try {
      const subscription = await this.getSubscriptionStatus();
      return subscription.isActive || subscription.isTrialActive;
    } catch {
      return false;
    }
  }

  // Get current subscription status
  async getSubscriptionStatus(): Promise<UserSubscription> {
    try {
      const stored = await AsyncStorage.getItem(this.storageKey);
      if (!stored) {
        return {
          isActive: false,
          isTrialActive: false,
        };
      }
      
      const subscription = JSON.parse(stored);
      
      // Check if subscription is still valid
      if (subscription.expiresAt && new Date(subscription.expiresAt) < new Date()) {
        subscription.isActive = false;
      }
      
      // Check if trial is still valid
      if (subscription.trialExpiresAt && new Date(subscription.trialExpiresAt) < new Date()) {
        subscription.isTrialActive = false;
      }
      
      return subscription;
    } catch {
      return {
        isActive: false,
        isTrialActive: false,
      };
    }
  }

  // Start free trial (7 days)
  async startFreeTrial(): Promise<void> {
    const trialExpiresAt = new Date();
    trialExpiresAt.setDate(trialExpiresAt.getDate() + 7);
    
    const subscription: UserSubscription = {
      isActive: false,
      isTrialActive: true,
      trialExpiresAt,
    };
    
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(subscription));
  }

  // Activate premium subscription
  async activateSubscription(planId: string, purchaseToken: string): Promise<void> {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');
    
    const expiresAt = new Date();
    if (plan.period === 'monthly') {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }
    
    const subscription: UserSubscription = {
      isActive: true,
      plan,
      expiresAt,
      purchaseDate: new Date(),
      isTrialActive: false,
    };
    
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(subscription));
  }

  // Cancel subscription
  async cancelSubscription(): Promise<void> {
    const subscription = await this.getSubscriptionStatus();
    subscription.isActive = false;
    await AsyncStorage.setItem(this.storageKey, JSON.stringify(subscription));
  }

  // Restore purchases
  async restorePurchases(): Promise<void> {
    // This would integrate with App Store/Play Store
    // For now, just check local storage
    const subscription = await this.getSubscriptionStatus();
    return Promise.resolve();
  }

  // Feature gates
  async canCreateUnlimitedHabits(): Promise<boolean> {
    return this.isPremiumUser();
  }

  async canAccessPremiumContent(): Promise<boolean> {
    return this.isPremiumUser();
  }

  async canExportData(): Promise<boolean> {
    return this.isPremiumUser();
  }

  async getMaxHabitsAllowed(): Promise<number> {
    const isPremium = await this.isPremiumUser();
    return isPremium ? Infinity : 3; // Free users get 3 habits
  }
}

export const subscriptionManager = new SubscriptionManager();
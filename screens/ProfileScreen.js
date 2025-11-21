import { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, Alert, Animated, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';

// Placeholder profile picture URL (replace or allow upload in real app)
const profilePicUrl = 'https://i.pravatar.cc/150';

export default function ProfileScreen() {
  // Use this to simulate user state
  const [user, setUser] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('progress');

  // Example progress values (keep as demo)
  const progressData = [
    { language: 'JavaScript', progress: 0.7, icon: '🟨', color: '#f7df1e' },
    { language: 'Python', progress: 0.5, icon: '🐍', color: '#3776ab' },
    { language: 'Java', progress: 0.3, icon: '☕', color: '#007396' },
    { language: 'C++', progress: 0.8, icon: '💠', color: '#00599c' },
    { language: 'React', progress: 0.9, icon: '⚛️', color: '#61dafb' },
  ];

  const achievements = [
    { id: 1, name: 'First Steps', icon: '👣', description: 'Complete your first quiz', unlocked: true },
    { id: 2, name: 'Quiz Master', icon: '🏆', description: 'Score 90%+ in any quiz', unlocked: true },
    { id: 3, name: 'Language Explorer', icon: '🌍', description: 'Learn 3+ languages', unlocked: false },
    { id: 4, name: 'Perfect Score', icon: '⭐', description: 'Get 100% in any quiz', unlocked: false },
  ];

  const statsData = [
    { label: 'Quizzes Taken', value: '15', icon: '📊' },
    { label: 'Learning Streak', value: '7 days', icon: '🔥' },
    { label: 'Total Score', value: '245', icon: '🎯' },
    { label: 'Languages', value: '5', icon: '💻' },
  ];

  // Voice Assistant Functions
  const speak = async (text, rate = 0.9) => {
    if (!voiceEnabled) return;
    
    try {
      setIsSpeaking(true);
      await Speech.speak(text, {
        rate: rate,
        pitch: 1.0,
        language: 'en-US',
        onDone: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    } catch (error) {
      console.log('Speech error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  const toggleVoiceAssistant = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const speakProgress = () => {
    const progressText = progressData.map(item => 
      `${item.language}: ${Math.round(item.progress * 100)} percent`
    ).join('. ');
    speak(`Your learning progress: ${progressText}`);
  };

  const speakAchievements = () => {
    const unlocked = achievements.filter(a => a.unlocked);
    const locked = achievements.filter(a => !a.unlocked);
    const unlockedText = unlocked.map(a => a.name).join(', ');
    const lockedText = locked.map(a => a.name).join(', ');
    speak(`You have unlocked ${unlocked.length} achievements: ${unlockedText}. Still to unlock: ${lockedText}`);
  };

  const handleLogin = () => {
    // Simulate login (set demo user)
    setUser({
      displayName: "Alex Johnson",
      email: "alex.johnson@example.com",
      joinDate: "2024-01-15"
    });
    if (voiceEnabled) {
      speak("Welcome back! Great to see you again. Ready to continue your coding journey?");
    }
  };

  const handleLogout = () => {
    if (voiceEnabled) {
      speak("Logging out. Hope to see you again soon!");
      setTimeout(() => setUser(null), 1500);
    } else {
      setUser(null);
    }
  };

  const calculateLevel = () => {
    const totalProgress = progressData.reduce((sum, item) => sum + item.progress, 0);
    return Math.floor(totalProgress / progressData.length * 10) + 1;
  };

  if (!user) {
    return (
      <View style={styles.container}>
        {/* Voice Assistant Control */}
        <TouchableOpacity 
          style={[
            styles.voiceToggle,
            { backgroundColor: voiceEnabled ? '#51cf66' : '#ff6b6b' }
          ]}
          onPress={toggleVoiceAssistant}
        >
          <Text style={styles.voiceToggleText}>
            {voiceEnabled ? '🔊' : '🔇'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginCard}>
          <View style={styles.loginHeader}>
            <Text style={styles.loginEmoji}>🔑</Text>
            <Text style={styles.loginTitle}>Welcome to Riseway</Text>
            <Text style={styles.loginSubtitle}>Your coding journey starts here</Text>
          </View>
          
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
            style={styles.loginIllustration}
          />
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>🚀 Start Learning Journey</Text>
          </TouchableOpacity>
          
          <Text style={styles.loginHint}>
            Join thousands of developers leveling up their skills
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Voice Assistant Controls */}
      <View style={styles.voiceControls}>
        <TouchableOpacity 
          style={[
            styles.voiceButton,
            { backgroundColor: voiceEnabled ? '#51cf66' : '#ff6b6b' }
          ]}
          onPress={toggleVoiceAssistant}
        >
          <Text style={styles.voiceButtonText}>
            {isSpeaking ? '🔊' : voiceEnabled ? '🔈' : '🔇'}
          </Text>
        </TouchableOpacity>
        
        {isSpeaking && (
          <TouchableOpacity
            onPress={stopSpeaking}
            style={styles.stopButton}
          >
            <Text style={styles.stopButtonText}>⏹️</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profilePicUrl }} style={styles.avatar} />
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>Lvl {calculateLevel()}</Text>
            </View>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.displayName}</Text>
            <Text style={styles.emailText}>{user.email}</Text>
            <Text style={styles.joinDate}>Member since {user.joinDate}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsContainer}
        >
          {statsData.map((stat, index) => (
            <TouchableOpacity 
              key={stat.label}
              style={styles.statCard}
              activeOpacity={0.7}
              onPress={() => voiceEnabled && speak(`${stat.label}: ${stat.value}`)}
            >
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
            onPress={() => setActiveTab('progress')}
          >
            <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
              📈 Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
            onPress={() => setActiveTab('achievements')}
          >
            <Text style={[styles.tabText, activeTab === 'achievements' && styles.activeTabText]}>
              🏆 Achievements
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content Area */}
        <View style={styles.contentArea}>
          {activeTab === 'progress' ? (
            <View style={styles.progressSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Learning Progress</Text>
                {voiceEnabled && (
                  <TouchableOpacity 
                    style={styles.voiceReadButton}
                    onPress={speakProgress}
                  >
                    <Text style={styles.voiceReadText}>🔊 Read</Text>
                  </TouchableOpacity>
                )}
              </View>

              {progressData.map((item, index) => (
                <TouchableOpacity 
                  key={item.language}
                  style={styles.progressCard}
                  activeOpacity={0.8}
                  onPress={() => voiceEnabled && speak(`${item.language} progress: ${Math.round(item.progress * 100)} percent`)}
                >
                  <View style={styles.progressHeader}>
                    <View style={styles.languageInfo}>
                      <Text style={styles.languageIcon}>{item.icon}</Text>
                      <Text style={styles.languageText}>{item.language}</Text>
                    </View>
                    <Text style={styles.progressPercent}>{Math.round(item.progress * 100)}%</Text>
                  </View>
                  
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${item.progress * 100}%`,
                          backgroundColor: item.color
                        }
                      ]} 
                    />
                  </View>
                  
                  <View style={styles.progressFooter}>
                    <Text style={styles.progressStatus}>
                      {item.progress >= 0.8 ? 'Advanced 🚀' : 
                       item.progress >= 0.5 ? 'Intermediate ⚡' : 
                       'Beginner 🌱'}
                    </Text>
                    {voiceEnabled && (
                      <Text style={styles.voiceHint}>👆 Tap to hear</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.achievementsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Your Achievements</Text>
                {voiceEnabled && (
                  <TouchableOpacity 
                    style={styles.voiceReadButton}
                    onPress={speakAchievements}
                  >
                    <Text style={styles.voiceReadText}>🔊 Read</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.achievementsGrid}>
                {achievements.map((achievement) => (
                  <TouchableOpacity
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      !achievement.unlocked && styles.achievementLocked
                    ]}
                    activeOpacity={0.7}
                    onPress={() => voiceEnabled && speak(
                      achievement.unlocked ? 
                      `Unlocked: ${achievement.name}. ${achievement.description}` :
                      `Locked: ${achievement.name}. ${achievement.description}`
                    )}
                  >
                    <Text style={[
                      styles.achievementIcon,
                      !achievement.unlocked && styles.achievementIconLocked
                    ]}>
                      {achievement.icon}
                    </Text>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                    <Text style={styles.achievementDesc}>{achievement.description}</Text>
                    <View style={[
                      styles.achievementStatus,
                      achievement.unlocked ? styles.statusUnlocked : styles.statusLocked
                    ]}>
                      <Text style={styles.statusText}>
                        {achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => {
              if (voiceEnabled) speak("Opening settings");
              Alert.alert('Settings', 'Settings panel would open here');
            }}
          >
            <Text style={styles.actionButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Text style={styles.actionButtonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  // Voice Controls
  voiceControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  voiceToggleText: {
    fontSize: 20,
    color: '#fff',
  },
  voiceButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  voiceButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  stopButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  // Login State
  loginCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  loginEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 10,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
  },
  loginIllustration: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginHint: {
    marginTop: 20,
    color: '#a0aec0',
    textAlign: 'center',
    fontSize: 14,
  },
  // Profile State
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 100,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#667eea',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#ff6b6b',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    color: '#667eea',
    marginBottom: 4,
    fontWeight: '500',
  },
  joinDate: {
    fontSize: 14,
    color: '#a0aec0',
  },
  // Stats
  statsScroll: {
    marginBottom: 20,
  },
  statsContainer: {
    paddingRight: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginRight: 15,
    minWidth: 120,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
  },
  activeTabText: {
    color: '#fff',
  },
  // Content
  contentArea: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  voiceReadButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  voiceReadText: {
    fontSize: 12,
    color: '#4a5568',
    fontWeight: '600',
  },
  // Progress Cards
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  languageText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2d3748',
  },
  progressPercent: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatus: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  voiceHint: {
    fontSize: 12,
    color: '#a0aec0',
    fontStyle: 'italic',
  },
  // Achievements
  achievementsSection: {
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d3748',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 10,
  },
  achievementStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusUnlocked: {
    backgroundColor: '#c6f6d5',
  },
  statusLocked: {
    backgroundColor: '#fed7d7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  // Action Buttons
  actionButtons: {
    gap: 12,
  },
  actionButton: {
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  dangerButton: {
    backgroundColor: '#fc8181',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
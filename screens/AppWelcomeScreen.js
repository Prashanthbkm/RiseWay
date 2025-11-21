import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, SafeAreaView, Image, ScrollView, Dimensions, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import * as SpeechSDK from 'expo-speech';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUOTES = [
  "“Code is like humor. When you have to explain it, it’s bad.” — Cory House",
  "“Make it work, make it right, make it fast.” — Kent Beck",
  "“The only way to learn a new programming language is by writing programs in it.” — Dennis Ritchie",
  "“First, solve the problem. Then, write the code.” — John Johnson",
  "“Learning never exhausts the mind.” — Leonardo da Vinci"
];

const LANGUAGES = [
  'JavaScript', 'Python', 'C++', 'Java', 'C#', 'PHP', 'SQL', 'Kotlin', 'MATLAB'
];

const LANG_EMOJI = {
  "JavaScript": "🟨",
  "Python": "🐍",
  "C++": "💠",
  "Java": "☕",
  "C#": "🎵",
  "PHP": "🐘",
  "SQL": "🗄️",
  "Kotlin": "🎯",
  "MATLAB": "📊"
};

const DAILY_FACTS = [
  "Did you know? Python was named after Monty Python, not the snake!",
  "JavaScript initially ran only in Netscape Navigator.",
  "MATLAB is commonly used for signal processing in engineering.",
  "PHP originally stood for 'Personal Home Page'.",
  "SQL is a declarative language, unlike Java/C++ which are imperative."
];

const RANDOM_BADGES = [
  { name: "First Quiz", color: "#ffe066", icon: "🥳" },
  { name: "Streak 3", color: "#b5ead7", icon: "🔥" },
  { name: "Quiz Master", color: "#b2f7ef", icon: "🏅" },
  { name: "All-rounder", color: "#ffd6e0", icon: "⭐" },
  { name: "Learner", color: "#a0c4ff", icon: "📘" }
];

const VOICE_WELCOMES = [
  "Welcome back to Riseway! Ready to continue your coding journey?",
  "Hello! Let's make today productive with some coding practice.",
  "Welcome! Your programming skills are waiting to be enhanced.",
  "Great to see you! Time to level up your coding knowledge.",
  "Hello there! Let's dive into the world of programming together."
];

// Voice Commands for Speech-to-Text
const VOICE_COMMANDS = {
  'navigate to languages': 'navigate_languages',
  'start learning': 'navigate_languages',
  'show languages': 'navigate_languages',
  'take quiz': 'navigate_languages',
  'read quote': 'read_quote',
  'read fact': 'read_fact',
  'read stats': 'read_stats',
  'my progress': 'read_stats',
  'quiz results': 'read_results',
  'my scores': 'read_results',
  'stop speaking': 'stop_speaking',
  'mute voice': 'toggle_voice',
  'enable voice': 'toggle_voice',
  'help': 'show_help'
};

function getBadge(score) {
  if (score >= 15) return "🥇 Perfect!";
  if (score >= 12) return "🥈 Great!";
  if (score >= 8) return "🥉";
  if (score > 0) return "👍";
  return "";
}

export default function AppWelcomeScreen({ navigation }) {
  const username = "Rohan";
  const [quoteIdx, setQuoteIdx] = useState(Math.floor(Math.random() * QUOTES.length));
  const [quizScores, setQuizScores] = useState({});
  const [dailyFact, setDailyFact] = useState("");
  const [badgeIdx, setBadgeIdx] = useState(Math.floor(Math.random() * RANDOM_BADGES.length));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [voiceCommandHistory, setVoiceCommandHistory] = useState([]);
  
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];
  const listenAnim = useState(new Animated.Value(1))[0];
  const isFocused = useIsFocused();

  // Speech-to-Text Functions
  const startListening = async () => {
    if (!voiceEnabled) {
      speak("Please enable voice assistant first to use speech commands.");
      return;
    }

    try {
      setIsListening(true);
      setTranscript('');
      setShowVoiceInput(true);
      
      // Start listening animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(listenAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(listenAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate speech recognition (you would integrate with actual speech recognition API)
      // For demo purposes, we'll simulate recognition after 3 seconds
      setTimeout(() => {
        simulateVoiceCommand();
      }, 3000);

    } catch (error) {
      console.log('Speech recognition error:', error);
      setIsListening(false);
      setShowVoiceInput(false);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    setShowVoiceInput(false);
    listenAnim.setValue(1);
  };

  const simulateVoiceCommand = () => {
    // Simulate different voice commands randomly for demo
    const commands = Object.keys(VOICE_COMMANDS);
    const randomCommand = commands[Math.floor(Math.random() * commands.length)];
    
    setTranscript(randomCommand);
    processVoiceCommand(randomCommand);
    
    // Auto-close after processing
    setTimeout(() => {
      setIsListening(false);
      setShowVoiceInput(false);
    }, 2000);
  };

  const processVoiceCommand = (command) => {
    const normalizedCommand = command.toLowerCase().trim();
    const action = VOICE_COMMANDS[normalizedCommand];
    
    if (action) {
      // Add to command history
      setVoiceCommandHistory(prev => [
        { command: normalizedCommand, timestamp: new Date().toLocaleTimeString() },
        ...prev.slice(0, 4) // Keep only last 5 commands
      ]);

      switch (action) {
        case 'navigate_languages':
          speak("Navigating to languages section");
          setTimeout(() => navigation.navigate('Languages'), 1500);
          break;
        case 'read_quote':
          readQuoteAndFact();
          break;
        case 'read_fact':
          speak(`Today's fact: ${dailyFact}`);
          break;
        case 'read_stats':
          readStats();
          break;
        case 'read_results':
          readQuizResults();
          break;
        case 'stop_speaking':
          stopSpeaking();
          break;
        case 'toggle_voice':
          toggleVoiceAssistant();
          break;
        case 'show_help':
          showVoiceHelp();
          break;
        default:
          speak("Command executed");
      }
    } else {
      speak(`Sorry, I didn't understand "${command}". Try saying "help" for available commands.`);
    }
  };

  const showVoiceHelp = () => {
    const helpText = `
      Available voice commands: 
      Navigate to languages, Start learning, Read quote, Read fact, 
      Read stats, Quiz results, Stop speaking, Mute voice, Enable voice, Help.
      Say any of these commands to control the app.
    `;
    speak(helpText);
  };

  // Voice Assistant Functions (Text-to-Speech)
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
    if (isListening) {
      stopListening();
    }
    setVoiceEnabled(!voiceEnabled);
    
    if (!voiceEnabled) {
      speak("Voice assistant enabled");
    } else {
      speak("Voice assistant disabled");
    }
  };

  const welcomeUser = () => {
    const welcomeMessage = VOICE_WELCOMES[Math.floor(Math.random() * VOICE_WELCOMES.length)];
    speak(welcomeMessage);
  };

  const readQuoteAndFact = () => {
    const quote = QUOTES[quoteIdx].replace(/[“”]/g, '');
    const fact = dailyFact;
    const fullText = `Today's quote: ${quote}. Daily fact: ${fact}`;
    speak(fullText, 0.85);
  };

  const readStats = () => {
    const statsText = `You have attempted ${attempted} quizzes. Your best score is ${bestScore} and average score is ${avgScore}. ${badge.name} badge unlocked!`;
    speak(statsText);
  };

  const readQuizResults = () => {
    if (attempted === 0) {
      speak("You haven't taken any quizzes yet. Start learning to see your progress!");
      return;
    }
    
    const resultsText = Object.entries(quizScores)
      .map(([lang, score]) => `${lang}: ${score} points`)
      .join('. ');
    speak(`Your quiz results: ${resultsText}`);
  };

  // Animations
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  useEffect(() => {
    setQuoteIdx(Math.floor(Math.random() * QUOTES.length));
    setDailyFact(DAILY_FACTS[Math.floor(Math.random() * DAILY_FACTS.length)]);
    setBadgeIdx(Math.floor(Math.random() * RANDOM_BADGES.length));

    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();

    // Auto welcome after animations
    setTimeout(() => {
      welcomeUser();
    }, 1500);
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      const scores = {};
      for (const lang of LANGUAGES) {
        const val = await AsyncStorage.getItem(`quiz_${lang}`);
        if (val !== null) scores[lang] = parseInt(val);
      }
      setQuizScores(scores);
    })();
  }, [isFocused]);

  const attempted = Object.keys(quizScores).length;
  const bestScore = attempted ? Math.max(...Object.values(quizScores)) : 0;
  const avgScore = attempted
    ? (Object.values(quizScores).reduce((a, b) => a + b, 0) / attempted).toFixed(1)
    : 0;
  const badge = RANDOM_BADGES[badgeIdx];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Voice Assistant Controls */}
      <View style={styles.voiceControls}>
        {/* Speech-to-Text Button */}
        <Animated.View 
          style={[
            styles.voiceInputButton,
            { 
              backgroundColor: isListening ? '#ffd43b' : '#74c0fc',
              transform: [{ scale: listenAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={isListening ? stopListening : startListening}
            style={styles.voiceButtonInner}
            activeOpacity={0.8}
          >
            <Text style={styles.voiceButtonText}>
              {isListening ? '🎤' : '🎤'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Text-to-Speech Button */}
        <Animated.View 
          style={[
            styles.voiceButton,
            { 
              backgroundColor: voiceEnabled ? '#51cf66' : '#ff6b6b',
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <TouchableOpacity
            onPress={toggleVoiceAssistant}
            style={styles.voiceButtonInner}
            activeOpacity={0.8}
          >
            <Text style={styles.voiceButtonText}>
              {isSpeaking ? '🔊' : voiceEnabled ? '🔈' : '🔇'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
        
        {isSpeaking && (
          <TouchableOpacity
            onPress={stopSpeaking}
            style={styles.stopButton}
            activeOpacity={0.8}
          >
            <Text style={styles.stopButtonText}>⏹️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Voice Input Modal */}
      {showVoiceInput && (
        <View style={styles.voiceInputOverlay}>
          <View style={styles.voiceInputContainer}>
            <Animated.View 
              style={[
                styles.listeningAnimation,
                { transform: [{ scale: listenAnim }] }
              ]}
            >
              <Text style={styles.listeningText}>🎤</Text>
            </Animated.View>
            <Text style={styles.listeningTitle}>
              {isListening ? "Listening..." : "Processing..."}
            </Text>
            {transcript ? (
              <Text style={styles.transcriptText}>"{transcript}"</Text>
            ) : (
              <Text style={styles.instructionText}>Speak now...</Text>
            )}
            <TouchableOpacity
              onPress={stopListening}
              style={styles.cancelListeningButton}
            >
              <Text style={styles.cancelListeningText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Voice Command History */}
      {voiceCommandHistory.length > 0 && (
        <View style={styles.commandHistory}>
          <Text style={styles.commandHistoryTitle}>Recent Commands:</Text>
          {voiceCommandHistory.map((item, index) => (
            <Text key={index} style={styles.commandHistoryItem}>
              {item.timestamp}: "{item.command}"
            </Text>
          ))}
        </View>
      )}

      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.headerShape,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.logoCircle}>
          <Image
            source={require('../assets/risway_logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Welcome Section */}
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.welcomeHeading}>Welcome, {username}! 👋</Text>
          
          <View style={[styles.badgeCard, { backgroundColor: badge.color }]}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
          </View>

          {/* Voice Command Hint */}
          <View style={styles.voiceHintCard}>
            <Text style={styles.voiceHintText}>
              🎤 Try saying: "Navigate to languages" or "Read stats"
            </Text>
          </View>
        </Animated.View>

        {/* Quote Card with Voice Controls */}
        <Animated.View 
          style={[
            styles.quoteCard, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.quoteHeader}>
            <Text style={styles.quoteLabel}>💭 Quote of the Day</Text>
            <TouchableOpacity
              onPress={readQuoteAndFact}
              style={styles.speakButton}
              activeOpacity={0.7}
              disabled={!voiceEnabled}
            >
              <Text style={[
                styles.speakButtonText,
                { color: voiceEnabled ? '#3e87cb' : '#ccc' }
              ]}>
                🔊 Read
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.quoteText}>{QUOTES[quoteIdx]}</Text>

          <View style={styles.factDivider} />
          <Text style={styles.factLabel}>📚 Daily Fact</Text>
          <Text style={styles.factText}>{dailyFact}</Text>
        </Animated.View>

        {/* Stats Cards with Voice */}
        <Animated.View 
          style={[
            styles.statsRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: "#ece9ff" }]}
            onPress={() => speak(`You have attempted ${attempted} quizzes`)}
            activeOpacity={0.8}
            disabled={!voiceEnabled}
          >
            <Text style={styles.statVal}>{attempted}</Text>
            <Text style={styles.statLabel}>Quizzes Taken</Text>
            {voiceEnabled && <Text style={styles.voiceHint}>👆 Tap to hear</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: "#c9e4de" }]}
            onPress={() => speak(`Your best score is ${bestScore}`)}
            activeOpacity={0.8}
            disabled={!voiceEnabled}
          >
            <Text style={styles.statVal}>{bestScore}</Text>
            <Text style={styles.statLabel}>Best Score</Text>
            {voiceEnabled && <Text style={styles.voiceHint}>👆 Tap to hear</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statCard, { backgroundColor: "#fbc3bc" }]}
            onPress={() => speak(`Your average score is ${avgScore}`)}
            activeOpacity={0.8}
            disabled={!voiceEnabled}
          >
            <Text style={styles.statVal}>{avgScore}</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
            {voiceEnabled && <Text style={styles.voiceHint}>👆 Tap to hear</Text>}
          </TouchableOpacity>
        </Animated.View>

        {/* Stats Summary Button */}
        <TouchableOpacity
          style={[
            styles.statsSummaryButton,
            { opacity: voiceEnabled ? 1 : 0.5 }
          ]}
          onPress={readStats}
          activeOpacity={0.8}
          disabled={!voiceEnabled}
        >
          <Text style={styles.statsSummaryText}>
            📊 Hear Your Progress Summary
          </Text>
        </TouchableOpacity>

        {/* Voice Commands Help */}
        <TouchableOpacity
          style={[
            styles.voiceHelpButton,
            { opacity: voiceEnabled ? 1 : 0.5 }
          ]}
          onPress={showVoiceHelp}
          activeOpacity={0.8}
          disabled={!voiceEnabled}
        >
          <Text style={styles.voiceHelpText}>
            🎤 Voice Commands Help
          </Text>
        </TouchableOpacity>

        {/* Quiz Results */}
        <Animated.View 
          style={[
            styles.resultsCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>📊 Your Quiz Results</Text>
            {attempted > 0 && voiceEnabled && (
              <TouchableOpacity
                onPress={readQuizResults}
                style={styles.speakButton}
                activeOpacity={0.7}
              >
                <Text style={styles.speakButtonText}>🔊 Read</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.quizResultsRow}>
            {attempted === 0 ? (
              <View style={styles.noQuizContainer}>
                <Text style={styles.noQuizYet}>No quizzes taken yet.</Text>
                <Text style={styles.noQuizSubtitle}>Start learning to see your progress!</Text>
              </View>
            ) : (
              Object.entries(quizScores).map(([lang, scr]) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.scorePill,
                    { backgroundColor: scr >= 10 ? '#a7ffaf' : '#d0edfa' }
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (voiceEnabled) {
                      speak(`You scored ${scr} in ${lang}. ${getBadge(scr)}`);
                    }
                  }}
                >
                  <Text style={styles.scoreEmoji}>{LANG_EMOJI[lang] || "🏅"}</Text>
                  <Text style={styles.scoreLang}>{lang}</Text>
                  <Text style={styles.scoreVal}>{scr}</Text>
                  <Text style={styles.scoreBadge}>{getBadge(scr)}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </Animated.View>

        {/* Spacer for the CTA button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed CTA Button - Positioned above bottom tab */}
      <Animated.View 
        style={[
          styles.ctaBtnContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => {
            if (voiceEnabled) {
              speak("Navigating to languages section. Get ready to learn!");
              setTimeout(() => navigation.navigate('Languages'), 1500);
            } else {
              navigation.navigate('Languages');
            }
          }}
          activeOpacity={0.9}
        >
          <Text style={styles.ctaBtnText}>Start Learning 🚀</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#f6f5ff' 
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
  voiceInputButton: {
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
  voiceButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceButtonText: {
    fontSize: 20,
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  stopButtonText: {
    fontSize: 16,
  },
  // Voice Input Overlay
  voiceInputOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  voiceInputContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '80%',
    elevation: 10,
  },
  listeningAnimation: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#74c0fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningText: {
    fontSize: 30,
  },
  listeningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  transcriptText: {
    fontSize: 16,
    color: '#1a659e',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  cancelListeningButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
  },
  cancelListeningText: {
    color: 'white',
    fontWeight: '600',
  },
  // Command History
  commandHistory: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 10,
    zIndex: 999,
    elevation: 5,
  },
  commandHistoryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  commandHistoryItem: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  // Voice Hint Card
  voiceHintCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 15,
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  voiceHintText: {
    fontSize: 12,
    color: '#1565c0',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Voice Help Button
  voiceHelpButton: {
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    backgroundColor: '#ffd8a8',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  voiceHelpText: {
    color: '#e67700',
    fontSize: 14,
    fontWeight: '600',
  },
  // ... (keep all your existing styles from the previous code)
  // Header and Layout
  headerShape: {
    width: '100%',
    height: 80,
    backgroundColor: '#3e87cb',
    borderBottomLeftRadius: 27,
    borderBottomRightRadius: 27,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: -32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    top: 18,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logo: { 
    width: 60, 
    height: 60, 
    borderRadius: 30 
  },
  container: { 
    paddingBottom: 0, 
    backgroundColor: '#f6f5ff',
    paddingTop: 20,
  },
  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 21,
    marginBottom: 15,
  },
  welcomeHeading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#20639b',
    marginBottom: 12,
    textShadowColor: 'rgba(32, 99, 155, 0.1)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  badgeIcon: { 
    fontSize: 26, 
    marginRight: 10 
  },
  badgeName: { 
    fontWeight: '700', 
    fontSize: 18, 
    color: '#393939' 
  },
  // Quote Card with Voice
  quoteCard: {
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    backgroundColor: '#fffbe9',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ffe066',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  quoteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  quoteLabel: { 
    color: '#7e858b', 
    fontSize: 15, 
    fontWeight: '600',
  },
  speakButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  speakButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  quoteText: { 
    fontSize: 17, 
    color: '#232445', 
    fontStyle: 'italic', 
    lineHeight: 22,
    marginBottom: 5,
  },
  factDivider: { 
    height: 2, 
    backgroundColor: "#ffeeaa", 
    marginVertical: 12,
    borderRadius: 1,
  },
  factLabel: { 
    color: "#b1624e", 
    fontSize: 15, 
    fontWeight: '700',
    marginBottom: 6,
  },
  factText: { 
    fontSize: 14.5, 
    color: "#845422",
    lineHeight: 20,
  },
  // Stats Section
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  statCard: {
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 18,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statVal: {
    color: '#1985a1',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 4,
  },
  statLabel: {
    color: '#3a5a40',
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  voiceHint: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  statsSummaryButton: {
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    backgroundColor: '#a0c4ff',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statsSummaryText: {
    color: '#1a659e',
    fontSize: 14,
    fontWeight: '600',
  },
  // Results Section
  resultsCard: {
    width: SCREEN_WIDTH * 0.92,
    alignSelf: 'center',
    backgroundColor: '#e0fbfc',
    borderRadius: 20,
    padding: 18,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#b5ead7',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultsTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#19647e',
  },
  quizResultsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  noQuizContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  noQuizYet: { 
    color: '#adb5bd', 
    fontSize: 16, 
    fontStyle: 'italic',
    marginBottom: 5,
  },
  noQuizSubtitle: {
    color: '#6c757d',
    fontSize: 14,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  scoreEmoji: { 
    fontSize: 16, 
    marginRight: 6 
  },
  scoreLang: { 
    fontSize: 14, 
    color: '#1a659e', 
    fontWeight: '700',
    marginRight: 8,
  },
  scoreVal: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#007f5f',
    marginRight: 6,
  },
  scoreBadge: { 
    fontSize: 14, 
    color: "#a98467",
    fontWeight: '600',
  },
  // CTA Button
  ctaBtnContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  ctaBtn: {
    backgroundColor: '#51cf66',
    borderRadius: 30,
    paddingVertical: 18,
    paddingHorizontal: 60,
    elevation: 12,
    shadowColor: '#51cf66',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    borderWidth: 2,
    borderColor: '#40c057',
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
  }
});
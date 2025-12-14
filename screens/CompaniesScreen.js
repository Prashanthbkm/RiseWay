import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, TouchableOpacity, Linking, Animated } from 'react-native';
import * as Speech from 'expo-speech';

const companies = [
  {
    name: 'Google',
    careerUrl: 'https://careers.google.com',
    domains: [
      { domain: 'AI', languages: ['Python', 'TensorFlow', 'C++'] },
      { domain: 'Cloud', languages: ['Go', 'Java', 'Python'] },
      { domain: 'Search', languages: ['C++', 'Java'] },
      { domain: 'Android', languages: ['Java', 'Kotlin'] }
    ]
  },
  {
    name: 'Microsoft',
    careerUrl: 'https://careers.microsoft.com',
    domains: [
      { domain: 'Cloud', languages: ['C#', '.NET', 'Python'] },
      { domain: 'Search', languages: ['C++', 'Java'] },
      { domain: 'Windows', languages: ['C++', 'C#'] }
    ]
  },
];

// Voice Commands for Speech-to-Text
const VOICE_COMMANDS = {
  'search google': 'search_google',
  'search microsoft': 'search_microsoft',
  'show all companies': 'show_all',
  'clear search': 'clear_search',
  'open google careers': 'open_google_careers',
  'open microsoft careers': 'open_microsoft_careers',
  'stop speaking': 'stop_speaking',
  'mute voice': 'toggle_voice',
  'enable voice': 'toggle_voice',
  'help': 'show_help'
};

function highlightString(text, query) {
  if (!query) return <Text>{text}</Text>;
  const re = new RegExp(`(${query})`, 'ig');
  const split = text.split(re);
  return split.map((chunk, i) =>
    chunk.toLowerCase() === query.toLowerCase()
      ? <Text key={i} style={styles.highlight}>{chunk}</Text>
      : <Text key={i}>{chunk}</Text>
  );
}

export default function CompaniesScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [showVoiceInput, setShowVoiceInput] = useState(false);
  const [voiceCommandHistory, setVoiceCommandHistory] = useState([]);
  
  const pulseAnim = useState(new Animated.Value(1))[0];
  const listenAnim = useState(new Animated.Value(1))[0];

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
        case 'search_google':
          setSearch('google');
          speak("Searching for Google");
          break;
        case 'search_microsoft':
          setSearch('microsoft');
          speak("Searching for Microsoft");
          break;
        case 'show_all':
          setSearch('');
          speak("Showing all companies");
          break;
        case 'clear_search':
          setSearch('');
          speak("Search cleared");
          break;
        case 'open_google_careers':
          speak("Opening Google careers page");
          setTimeout(() => Linking.openURL(companies[0].careerUrl), 1500);
          break;
        case 'open_microsoft_careers':
          speak("Opening Microsoft careers page");
          setTimeout(() => Linking.openURL(companies[1].careerUrl), 1500);
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
      // Try to use the command as search term
      setSearch(command);
      speak(`Searching for ${command}`);
    }
  };

  const showVoiceHelp = () => {
    const helpText = `
      Available voice commands: 
      Search Google, Search Microsoft, Show all companies, Clear search,
      Open Google careers, Open Microsoft careers, Stop speaking, 
      Mute voice, Enable voice, Help.
      Or say any company name, domain, or language to search.
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
        pitch: 0.8, // Lower pitch for male voice
        volume: 0.9, // Louder volume
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

  const speakCompanyInfo = (company) => {
    const domainText = company.domains.map(dom => 
      `${dom.domain} using ${dom.languages.join(', ')}`
    ).join('. ');
    
    const fullText = `${company.name}. Domains include: ${domainText}. Visit career page for more opportunities.`;
    speak(fullText, 0.85);
  };

  const speakSearchResults = () => {
    if (search.trim() === '') {
      speak(`Showing all ${companies.length} companies. ${companies.map(c => c.name).join(' and ')}`);
    } else if (filtered.length === 0) {
      speak(`No companies found for search term: ${search}`);
    } else {
      speak(`Found ${filtered.length} companies matching: ${search}`);
    }
  };

  const speakCompanyDetails = (company) => {
    const domainDetails = company.domains.map(domain => 
      `${domain.domain}: ${domain.languages.join(', ')}`
    ).join('. ');
    
    speak(`${company.name} works in ${company.domains.length} domains. ${domainDetails}`);
  };

  // Pulse animation for voice button
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

  // Speak when search results change
  useEffect(() => {
    if (search && voiceEnabled) {
      const timeoutId = setTimeout(() => {
        speakSearchResults();
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    }
  }, [search]);

  const filtered = companies.filter(company => {
    const q = search.trim().toLowerCase();
    if (company.name.toLowerCase().includes(q)) return true;
    return company.domains.some(
      d =>
        d.domain.toLowerCase().includes(q) ||
        d.languages.some(l => l.toLowerCase().includes(q))
    );
  });

  return (
    <View style={styles.safe}>
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

      <View style={styles.headerWrap}>
        <Text style={styles.title}>
          <Text style={{ fontSize: 22, color: "#245283" }}>🏢 </Text>
          Companies
        </Text>
        
        {/* Search with Voice Controls */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBar}
            value={search}
            onChangeText={setSearch}
            placeholder="Search company, domain, or language..."
            placeholderTextColor="#adb5bd"
          />
          <View style={styles.searchVoiceControls}>
            {voiceEnabled && search && (
              <TouchableOpacity
                onPress={speakSearchResults}
                style={styles.searchVoiceButton}
                activeOpacity={0.7}
              >
                <Text style={styles.searchVoiceText}>🔊</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={startListening}
              style={styles.searchMicButton}
              activeOpacity={0.7}
            >
              <Text style={styles.searchMicText}>🎤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voice Command Hint */}
        {voiceEnabled && (
          <View style={styles.voiceHintCard}>
            <Text style={styles.voiceHintText}>
              🎤 Try: "Search Google" or "Open Microsoft careers"
            </Text>
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {filtered.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResult}>No companies found.</Text>
            {voiceEnabled && (
              <TouchableOpacity
                onPress={() => speak("No companies found for your search. Try saying 'Show all companies' or search for Google or Microsoft.")}
                style={styles.speakHint}
                activeOpacity={0.7}
              >
                <Text style={styles.speakHintText}>🔊 Hear suggestions</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filtered.map(company => (
            <TouchableOpacity 
              key={company.name} 
              style={styles.companyCard}
              onPress={() => {
                if (voiceEnabled) {
                  speakCompanyDetails(company);
                  setTimeout(() => navigation.navigate('CompanyDetails', { 
                    companyId: companies[0].name === company.name ? '1' : '2' 
                  }), 2000);
                } else {
                  navigation.navigate('CompanyDetails', { 
                    companyId: companies[0].name === company.name ? '1' : '2' 
                  });
                }
              }}
              activeOpacity={0.8}
            >
              {/* Company Header with Voice */}
              <View style={styles.companyHeader}>
                <Text style={styles.companyName}>{highlightString(company.name, search)}</Text>
                {voiceEnabled && (
                  <TouchableOpacity
                    onPress={() => speakCompanyInfo(company)}
                    style={styles.companyVoiceButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.voiceIcon}>🔊</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Career Link with Voice */}
              {company.careerUrl && (
                <TouchableOpacity 
                  onPress={() => {
                    if (voiceEnabled) {
                      speak(`Opening ${company.name} career page in browser`);
                      setTimeout(() => Linking.openURL(company.careerUrl), 1500);
                    } else {
                      Linking.openURL(company.careerUrl);
                    }
                  }} 
                  activeOpacity={0.7}
                  style={styles.careerLinkContainer}
                >
                  <Text style={styles.careerLink}>🌐 Visit Career Page</Text>
                  {voiceEnabled && (
                    <Text style={styles.voiceHint}>Tap to hear then open</Text>
                  )}
                </TouchableOpacity>
              )}

              <Text style={styles.domainLabel}>Domains & Languages:</Text>
              
              {/* Domains with Voice */}
              {(search
                ? company.domains.filter(
                  d =>
                    d.domain.toLowerCase().includes(search.toLowerCase()) ||
                    d.languages.some(l => l.toLowerCase().includes(search.toLowerCase()))
                )
                : company.domains
              ).map((dom, i) => (
                <TouchableOpacity
                  key={`${company.name}-${dom.domain}-${i}`}
                  style={styles.domainBox}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (voiceEnabled) {
                      speak(`${dom.domain} domain uses ${dom.languages.join(', ')}`);
                    }
                  }}
                >
                  <View style={styles.domainHeader}>
                    <Text style={styles.domainTitle}>{highlightString(dom.domain, search)}</Text>
                    {voiceEnabled && (
                      <Text style={styles.domainVoiceHint}>👆 Tap to hear</Text>
                    )}
                  </View>
                  <Text style={styles.domainLangs}>
                    {dom.languages.map((l, idx) => (
                      <React.Fragment key={idx}>
                        {idx > 0 && ', '}
                        {highlightString(l, search)}
                      </React.Fragment>
                    ))}
                  </Text>
                </TouchableOpacity>
              ))}
            </TouchableOpacity>
          ))
        )}
        
        {/* Voice Controls Section */}
        {voiceEnabled && (
          <View style={styles.voiceControlsSection}>
            {filtered.length > 0 && (
              <TouchableOpacity
                style={styles.voiceSummary}
                onPress={() => {
                  const summary = `Found ${filtered.length} companies. ${filtered.map(c => c.name).join(', ')}`;
                  speak(summary);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.voiceSummaryText}>
                  🔊 Hear Companies Summary
                </Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              style={styles.voiceHelpButton}
              onPress={showVoiceHelp}
              activeOpacity={0.8}
            >
              <Text style={styles.voiceHelpText}>
                🎤 Voice Commands Help
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: "#f3f6fa",
    paddingTop: Platform.OS === 'android' ? 35 : 10,
  },
  // Voice Controls
  voiceControls: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 45 : 50,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  voiceInputButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  voiceButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
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
    fontSize: 18,
  },
  stopButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
    fontSize: 14,
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
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#74c0fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  listeningText: {
    fontSize: 28,
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
    top: Platform.OS === 'android' ? 100 : 110,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
  // Header
  headerWrap: {
    backgroundColor: "#f3f6fa",
    paddingBottom: 6,
    paddingHorizontal: 0,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    marginLeft: 16,
    color: '#1d3557',
    marginBottom: 2,
    marginTop: 6
  },
  searchContainer: {
    position: 'relative',
    marginHorizontal: 16,
  },
  searchBar: {
    backgroundColor: "#e9ecef",
    borderRadius: 13,
    marginTop: 3,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: "#23245c",
    paddingRight: 90, // Space for voice buttons
  },
  searchVoiceControls: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    flexDirection: 'row',
    gap: 8,
  },
  searchVoiceButton: {
    padding: 5,
  },
  searchVoiceText: {
    fontSize: 16,
    color: '#3e87cb',
  },
  searchMicButton: {
    padding: 5,
  },
  searchMicText: {
    fontSize: 16,
    color: '#ff6b6b',
  },
  // Voice Hint Card
  voiceHintCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  voiceHintText: {
    fontSize: 12,
    color: '#1565c0',
    textAlign: 'center',
    fontWeight: '500',
  },
  container: { paddingBottom: 30, paddingTop: 4 },
  // Company Card
  companyCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    marginHorizontal: 18,
    marginBottom: 17,
    padding: 17,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 4 },
    shadowOpacity: 0.06,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  companyName: { 
    fontSize: 20, 
    fontWeight: "bold", 
    color: "#174489", 
    flex: 1,
  },
  companyVoiceButton: {
    padding: 5,
    marginLeft: 10,
  },
  voiceIcon: {
    fontSize: 14,
    color: '#3e87cb',
  },
  careerLinkContainer: {
    marginBottom: 10,
  },
  careerLink: {
    color: '#1a78c2',
    marginBottom: 4,
    textDecorationLine: 'underline',
    fontSize: 15,
    fontWeight: '600',
  },
  voiceHint: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
  },
  domainLabel: { 
    fontWeight: '700', 
    color: "#4b6474", 
    marginBottom: 8, 
    fontSize: 15 
  },
  domainBox: {
    backgroundColor: "#e3e6fa",
    marginBottom: 10,
    borderRadius: 8,
    padding: 12,
  },
  domainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  domainTitle: { 
    fontWeight: '600', 
    color: "#395886", 
    fontSize: 16, 
    flex: 1,
  },
  domainVoiceHint: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },
  domainLangs: { 
    color: "#174489", 
    fontSize: 14, 
    flexWrap: 'wrap', 
    flexDirection: 'row',
    lineHeight: 20,
  },
  highlight: {
    backgroundColor: '#fff176',
    color: '#b26500',
    fontWeight: 'bold'
  },
  // No Results
  noResultContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResult: { 
    color: '#d90429', 
    textAlign: 'center', 
    fontSize: 16,
    marginBottom: 10,
  },
  speakHint: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  speakHintText: {
    color: '#6c757d',
    fontSize: 12,
    fontStyle: 'italic',
  },
  // Voice Controls Section
  voiceControlsSection: {
    marginHorizontal: 18,
    marginTop: 10,
  },
  voiceSummary: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  voiceSummaryText: {
    color: '#1565c0',
    fontSize: 14,
    fontWeight: '600',
  },
  voiceHelpButton: {
    backgroundColor: '#ffd8a8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffc078',
  },
  voiceHelpText: {
    color: '#e67700',
    fontSize: 14,
    fontWeight: '600',
  },
});
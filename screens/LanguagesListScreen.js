import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const languageData = {
  Python: { type: 'Backend', level: 'Beginner-Friendly', use: 'Web, AI, Data Science' },
  JavaScript: { type: 'Frontend', level: 'Beginner-Friendly', use: 'Web, Mobile, Desktop' },
  Java: { type: 'Backend', level: 'Intermediate', use: 'Enterprise, Android, Big Data' },
  'C++': { type: 'System', level: 'Advanced', use: 'Games, Embedded, High Performance' },
  Go: { type: 'Backend', level: 'Intermediate', use: 'Cloud, Microservices, CLI' },
  'C#': { type: 'Backend', level: 'Intermediate', use: 'Games, Enterprise, Desktop' },
  Kotlin: { type: 'Mobile', level: 'Beginner-Friendly', use: 'Android, Backend' },
  TensorFlow: { type: 'Framework', level: 'Advanced', use: 'AI, Machine Learning' },
};

export default function LanguagesListScreen({ route }) {
  const { language } = route.params;
  const info = languageData[language];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 {language}</Text>
      
      <View style={styles.infoCard}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{info?.type || 'N/A'}</Text>
        
        <Text style={styles.label}>Difficulty Level:</Text>
        <Text style={styles.value}>{info?.level || 'N/A'}</Text>
        
        <Text style={styles.label}>Common Use:</Text>
        <Text style={styles.value}>{info?.use || 'N/A'}</Text>
      </View>
      
      <Text style={styles.tip}>
        💡 Tip: Practice regularly and build projects to master {language}!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1a237e',
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474f',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#546e7a',
    marginBottom: 5,
  },
  tip: {
    fontSize: 14,
    color: '#5d4037',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
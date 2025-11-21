import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const domainData = {
  AI: {
    languages: ["Python", "R", "Java"],
    frameworks: ["TensorFlow", "PyTorch", "scikit-learn"]
  },
  Cloud: {
    languages: ["Python", "Go", "Java", "C#"],
    frameworks: ["AWS", "Azure", "Google Cloud", "OpenStack"]
  },
  Search: {
    languages: ["Java", "C++", "Python"],
    frameworks: ["Elasticsearch", "Solr"]
  },
  Office: {
    languages: ["C#", "TypeScript", "JavaScript"],
    frameworks: [".NET", "WinForms", "Web APIs"]
  },
  Gaming: {
    languages: ["C++", "C#", "Java"],
    frameworks: ["Unity", "Unreal Engine", "MonoGame"]
  }
};

export default function DomainDetailScreen({ route }) {
  const { domain } = route.params;
  const info = domainData[domain];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>
        <MaterialCommunityIcons name="search-web" size={25} color="#184e77" /> {domain}
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="language-python" size={22} color="#52796f" /> Languages:
        </Text>

        {info ? (
          info.languages.map(lang => (
            <View style={styles.tagBox} key={lang}>
              <Text style={styles.tagText}>{lang}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No languages found.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          <MaterialCommunityIcons name="code-tags" size={22} color="#52796f" /> Frameworks:
        </Text>

        {info ? (
          info.frameworks.map(fw => (
            <View style={styles.tagBox} key={fw}>
              <Text style={styles.tagText}>{fw}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No frameworks found.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    paddingBottom: 48,
    alignItems: 'center',
    backgroundColor: '#ecf2f9',
    minHeight: '100%',
    paddingTop: 50,
  },
  headerText: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#184e77',
    marginTop: 18,
    marginBottom: 28,
    textAlign: 'center',
    letterSpacing: 1,
  },
  section: {
    width: '100%',
    marginBottom: 34,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '600',
    color: '#52796f',
    marginBottom: 12,
    textAlign: 'left'
  },
  tagBox: {
    backgroundColor: '#f7fff7',
    borderRadius: 12,
    paddingVertical: 9,
    paddingHorizontal: 22,
    margin: 7,
    elevation: 2,
    shadowColor: '#52796f',
  },
  tagText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#14213d',
    textAlign: 'center'
  },
  noData: {
    fontSize: 15,
    color: '#7c7c7c',
    fontStyle: 'italic'
  }
});
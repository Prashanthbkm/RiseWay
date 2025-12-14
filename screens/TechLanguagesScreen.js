import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const LANGS = [
  { id: '0', name: 'JavaScript', color: '#f9c74f', icon: 'language-javascript', lib: 'MaterialCommunityIcons' },
  { id: '1', name: 'Java', color: '#ffadad', icon: 'coffee', lib: 'FontAwesome' },
  { id: '2', name: 'C++', color: '#ffd6a5', icon: 'language-cpp', lib: 'MaterialCommunityIcons' },
  { id: '3', name: 'C#', color: '#fdffb6', icon: 'language-csharp', lib: 'MaterialCommunityIcons' },
  { id: '4', name: 'PHP', color: '#caffbf', icon: 'language-php', lib: 'MaterialCommunityIcons' },
  { id: '5', name: 'SQL', color: '#9bf6ff', icon: 'database', lib: 'FontAwesome' },
  { id: '6', name: 'Kotlin', color: '#a0c4ff', icon: 'alpha-k-circle-outline', lib: 'MaterialCommunityIcons' },
  { id: '7', name: 'MATLAB', color: '#bdb2ff', icon: 'function', lib: 'MaterialCommunityIcons' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 10;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 3) / 2;

export default function TechLanguagesScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const filtered = LANGS.filter(lang =>
    lang.name.toLowerCase().includes(search.toLowerCase())
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛠 Tech Languages</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search language..."
        value={search}
        onChangeText={setSearch}
        autoCorrect={false}
        autoCapitalize="none"
      />
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => {
          const IconComp = item.lib === 'FontAwesome' ? FontAwesome : MaterialCommunityIcons;
          return (
            <TouchableOpacity
              style={[styles.langCard, { backgroundColor: item.color, width: CARD_WIDTH, marginHorizontal: CARD_MARGIN / 2 }]}
              onPress={() => navigation.navigate('LanguageDetail', { language: item.name })}
              activeOpacity={0.92}
            >
              <IconComp name={item.icon} size={38} color="#184e77" style={{ marginBottom: 10 }} />
              <Text style={styles.langName}>{item.name}</Text>
            </TouchableOpacity>
          )
        }}
        ListEmptyComponent={<Text style={styles.noResults}>No languages found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f8fc', paddingTop: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#184e77', marginBottom: 10, textAlign: 'center' },
  searchInput: { width: '92%', height: 42, borderColor: '#bfd8e3', borderWidth: 1, borderRadius: 10, fontSize: 16, paddingHorizontal: 16, marginBottom: 18, backgroundColor: '#fff', alignSelf: 'center' },
  row: { justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: CARD_MARGIN },
  langCard: { borderRadius: 18, paddingVertical: 35, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#184e77', shadowOpacity: 0.05, shadowRadius: 5, marginVertical: 6 },
  langName: { fontSize: 19, fontWeight: 'bold', color: '#184e77', letterSpacing: 0.5, marginTop: 8 },
  noResults: { textAlign: 'center', fontSize: 16, color: '#888', marginTop: 44 },
});
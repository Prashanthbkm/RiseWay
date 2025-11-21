import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const companies = [
  {
    id: '1',
    name: 'Google',
    careerUrl: 'https://careers.google.com',
    domains: ['AI', 'Cloud', 'Search']
  },
  {
    id: '2',
    name: 'Microsoft',
    careerUrl: 'https://careers.microsoft.com',
    domains: ['Cloud', 'Office', 'Gaming']
  }
];

export default function CompanyDetailScreen({ route, navigation }) {
  const { companyId } = route.params;
  const company = companies.find((c) => c.id === companyId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{company.name}</Text>

      {company.careerUrl && (
        <TouchableOpacity onPress={() => Linking.openURL(company.careerUrl)} activeOpacity={0.7} style={{marginVertical: 10}}>
          <Text style={styles.careerLink}>Visit Career Page</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.subtitle}>Domains:</Text>
      <View style={styles.domainsWrap}>
        {company.domains.map((d) => (
          <TouchableOpacity
            style={styles.domainTag}
            key={d}
            onPress={() => navigation.navigate('DomainDetails', { domain: d })}
          >
            <Text style={styles.domainText}>{d}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#184e77',
    marginBottom: 18,
    textAlign: 'center',
  },
  careerLink: {
    color: '#1a78c2',
    fontWeight: 'bold',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  subtitle: {
    fontSize: 18,
    color: "#3a5a40",
    marginBottom: 10,
    fontWeight: "500"
  },
  domainsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  domainTag: {
    backgroundColor: '#80ffea',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 18,
    margin: 4,
  },
  domainText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14213d',
  }
});
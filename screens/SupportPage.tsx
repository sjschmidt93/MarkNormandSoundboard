import React from "react"
import { NavigationProps, navigationOptions, tuesdaysBlue } from "./CharacterSelect"
import { View, StyleSheet, Image, Text } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export default class SupportPage extends React.Component<NavigationProps> {
  static navigationOptions = navigationOptions

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, styles.header]}>Support Joe and Mark</Text>
        <View style={styles.innerContainer}>
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Visit their websites</Text>
            <TouchableOpacity style={styles.websiteContainer}>
              <Text style={styles.websiteText}>comedianjoelist.com</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.websiteContainer}>
              <Text style={styles.websiteText}>marknormandcomedy.com</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Back them on patreon</Text>
            <Image source={require('./../assets/images/become_a_patron.png')} style={styles.patreonImage} />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.text}>Buy them a gift cards!</Text>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: tuesdaysBlue,
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sectionContainer: {
    alignItems: 'center'
  },
  websiteContainer: {
    backgroundColor: 'grey',
    width: 300,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 5
  },
  patreonImage: {
    height: 40,
    width: 200,
    marginTop: 20
  },
  text: {
    color: 'white',
    fontSize: 28,
    textAlign: 'center'
  },
  websiteText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'white'
  },
  header: {
    paddingBottom: 20,
    fontSize: 32
  }
})
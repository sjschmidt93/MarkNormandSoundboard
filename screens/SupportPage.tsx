import React from "react"
import { NavigationProps, navigationOptions, tuesdaysBlue } from "./CharacterSelect"
import { View, StyleSheet, Image, Text, Linking } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Ionicons } from '@expo/vector-icons'

export default class SupportPage extends React.Component<NavigationProps> {
  static navigationOptions = {...navigationOptions, title: "Support Joe and Mark" }

  onPressChipotle = () => 
    Linking.openURL("https://chipotlestore.wgiftcard.com/responsive/personalize_responsive/chooseDesign/chipotle_responsive/1")

  onPressUber = () =>
    Linking.openURL("https://uber.cashstar.com/store/?ref=uberlanding&locale=en-us")

  onPressPatreon = () => 
    Linking.openURL("https://www.patreon.com/tuesdays/posts")

  onPressShirt = () =>
    Linking.openURL("https://podcastmerch.com/collections/tuesdays-with-stories")

  websites = (
    <View style={styles.sectionContainer}>
      <Text style={[styles.text, styles.websiteHeader]}>Visit their websites</Text>
      <TouchableOpacity style={styles.websiteContainer}>
        <Text style={styles.websiteText}>comedianjoelist.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.websiteContainer, styles.markWebsiteContainer]}>
        <Text style={styles.websiteText}>marknormandcomedy.com</Text>
      </TouchableOpacity>
    </View>
  )

  patreon = (
    <View style={styles.sectionContainer}>
      <Text style={styles.text}>Back them on patreon</Text>
      <TouchableOpacity onPress={this.onPressPatreon}>
        <Image source={require('./../assets/images/become_a_patron.png')} style={styles.patreonImage} />
      </TouchableOpacity>
    </View>
  )

  giftCards = (
    <>
      <View style={styles.sectionContainer}>
        <Text style={styles.text}>Buy them a gift card</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={this.onPressChipotle}>
            <Image source={require('./../assets/images/chipotle.png')} style={styles.chipotleImage} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.uberImageContainer} onPress={this.onPressUber}>
            <Image source={require('./../assets/images/uber.png')} style={styles.uberImage} />
          </TouchableOpacity>
        </View>
        <>
          <View style={styles.emailContainer}>
            <Ionicons name="ios-mail" color="white" size={22} />
            <Text style={styles.emailText}> : joelistcomedy@gmail.com</Text>
          </View>
          <View style={styles.emailContainer}>
            <Ionicons name="ios-mail" color="white" size={22} />
            <Text style={styles.emailText}> : marksemail@gmail.com</Text>
          </View>
        </>
      </View>
    </>
  )

  shirts = (
    <View style={styles.sectionContainer}>
      <Text style={[styles.text, styles.websiteHeader]}>Buy a shirt</Text>
      <TouchableOpacity style={styles.websiteContainer} onPress={this.onPressShirt}>
        <Text style={styles.websiteText}>
          podcastmerch.com
        </Text>
      </TouchableOpacity>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {this.patreon}
          {this.giftCards}
          {this.shirts}
          {this.websites}
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  emailText: {
    color: 'white',
    fontSize: 18
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginBottom: 20
  },
  sectionContainer: {
    alignItems: 'center',
  },
  websiteContainer: {
    backgroundColor: '#808080',
    width: 250,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 5
  },
  markWebsiteContainer: {
    backgroundColor: '#696969'
  },
  websiteHeader: {
    paddingBottom: 15
  },
  patreonImage: {
    height: 40,
    width: 200,
    marginTop: 20
  },
  chipotleImage: {
    height: 90,
    width: 90,
    margin: 10,
    marginTop: 20,
  },
  uberImageContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 5,
    borderRadius: 5
  },
  uberImage: {
    height: 75,
    width: 75
  },
  text: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center'
  },
  websiteText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white'
  },
  header: {
    paddingBottom: 20,
    fontSize: 34
  }
})

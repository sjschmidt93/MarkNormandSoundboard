import React from 'react'
import { View, Text, StyleSheet, Image, Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationScreenProp, NavigationState, NavigationParams } from 'react-navigation'
import { SocialIcon } from 'react-native-elements'
import { Audio } from 'expo-av'
import { Comedian, SoundStoreProp } from './SoundGrid'
import { inject, observer } from 'mobx-react'
import { Octicons } from '@expo/vector-icons'

export const tuesdaysBlue = '#032D46'

export interface NavigationProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

@inject('soundStore')
@observer
export default class CharacterSelect extends React.Component<NavigationProps & SoundStoreProp> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    },
    headerTintColor: 'white'
  }

  startScreenSound = this.props.navigation.getParam('sound')

  joeAudio = new Audio.Sound()
  markAudio = new Audio.Sound()

  componentDidMount() {
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      await this.markAudio.loadAsync(require('./../assets/sounds/praise_allah.mp3'))
      await this.joeAudio.loadAsync(require('./../assets/sounds/praise_allah.mp3'))
    } catch (error) {
      console.warn("Failed to load audio")
    }
  }

  onPressMark = () => {
    this.props.navigation.navigate('SoundGrid', { comedian: Comedian.MARK })
    this.props.soundStore.stop()
  }

  onPressJoe = () => {
    this.props.navigation.navigate('SoundGrid', { comedian: Comedian.JOE })
    this.props.soundStore.stop()
  }

  render() {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
           <Text style={styles.chooseText}>Choose your Comedian</Text>
           <View style={styles.socialContainer}>
              <SocialIcon type="twitter"    onPress={() => Linking.openURL('https://twitter.com/tuesdaystories?lang=en')} />
              <SocialIcon type="facebook"   onPress={() => Linking.openURL('https://www.facebook.com/TuesdayStories/')} />
              <SocialIcon type="soundcloud" onPress={() => Linking.openURL('https://soundcloud.com/tuesdays_with_stories')} />
              <SocialIcon type="youtube"    onPress={() => Linking.openURL('https://www.youtube.com/channel/UCsE74YJvPJpaquzTPMO8hAA')} />
            </View>
            <View style={styles.comedianButtonsRowContainer}>
              <View style={styles.comedianButtonContainer}>
                <TouchableOpacity onPress={this.onPressMark}>
                  <Image source={require('./../assets/images/mark_select_screen.jpg')} style={styles.comedianButton} />
                </TouchableOpacity>
                <Text style={styles.comedianText}>Mark Normand</Text>
              </View>
              <View style={styles.comedianButtonContainer}>
                <TouchableOpacity onPress={this.onPressJoe}>
                  <Image source={require('./../assets/images/joe_select_screen.jpg')} style={styles.comedianButton} />
                </TouchableOpacity>
                <Text style={styles.comedianText}>Joe List</Text>
              </View>
            </View>
          </View>
          <MuteButton />
        </View>
      )
  }
}

@inject('soundStore')
@observer
export class MuteButton extends React.Component<SoundStoreProp> {
  render() {
    return (
      <TouchableOpacity style={styles.muteButtonContainer} onPress={this.props.soundStore.toggleMute}>
        <Octicons name={this.props.soundStore.isMuted ? "mute" : "unmute"} size={25} color="white" />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    backgroundColor: tuesdaysBlue,
    width: '100%',
    flex: 1,
    justifyContent: 'space-between'
  },
  chooseText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24
  },
  text: {
    paddingTop: 5
  },
  comedianText: {
    color: 'white',
    paddingTop: 5
  },
  comedianButtonContainer: {
    alignItems: 'center',
    paddingHorizontal: 5
  },
  comedianButtonsRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20
  },
  comedianButton: {
    height: 400,
    width: 175,
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 4
  },
  socialContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    flexDirection: 'row',
    paddingHorizontal: 30,
    justifyContent: 'space-between'
  },
  muteButtonContainer: {
    padding: 10,
    alignSelf: 'flex-end'
  }
})

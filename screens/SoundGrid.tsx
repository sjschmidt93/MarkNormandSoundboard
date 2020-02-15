import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { NavigationProps, tuesdaysBlue } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import _ from "lodash"
import { observer, inject } from 'mobx-react'
import { computed } from 'mobx'
import { SoundStore } from "../SoundStore"
import SocialRow from "../components/SocialRow"
import PlaybackButtons, { PLAYBACK_BUTTONS_HEIGHT } from "../components/PlaybackButtons"

export interface SoundStoreProp {
  soundStore: SoundStore
}

export enum Comedian {
  JOE = 'Joe',
  MARK = 'Mark'
}

@inject('soundStore')
@observer
export default class SoundGrid extends React.Component<NavigationProps & SoundStoreProp> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    },
    headerTintColor: 'white'
  }

  @computed
  get comedian() {
    return this.props.navigation.getParam('comedian')
  }

  @computed
  get gridProps() {
    return this.comedian === Comedian.MARK ? markGridProps : joeGridProps
  }

  onPressStop = () => this.props.soundStore.stop()

  render () {
    return (
      <View style={{ flex : 1 }}>
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: PLAYBACK_BUTTONS_HEIGHT }}>
          <View style={styles.container}>
            <Text style={styles.comedianText}>{this.comedian}</Text>
            <SocialRow comedian={this.comedian} />
            {
              this.gridProps.map((gridProps, index) => (
                <View key={index} style={styles.rowContainer}>
                  { 
                    gridProps.map((props, index) => 
                      <Square key={index} sound={props.sound} text={props.text} />
                    )
                  }
                </View>
              ))
            }
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <PlaybackButtons />
        </View>
      </View>
    )
  }
}
  
export interface SquareProps {
  sound: PlaybackSource
  text: string
}

@inject('soundStore')
@observer
class Square extends React.Component<SquareProps & SoundStoreProp> {
  sound = new Audio.Sound()
  duration = 0
  played = false

  componentDidMount() {
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      await this.sound.loadAsync(this.props.sound)
      this.sound.getStatusAsync()
        .then(status => {
          if (status.isLoaded) {
            this.duration = status.durationMillis
          }
        })
    } catch (error) {
      console.warn('Failed to to load' + this.props.sound)
    }
  }

  onPress = () => {
    this.props.soundStore.stop()

    this.props.soundStore.duration = this.duration

    this.props.soundStore.soundText = this.props.text

    this.props.soundStore.animateBar()
    if (this.played) {
      this.props.soundStore.replay(this.sound)
    } else {
      this.props.soundStore.play(this.sound)
      this.played = true
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={styles.square}>
        <Text style={styles.squareText}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    flex: 1
  },
  playbackContainerText: {
    textAlign: 'center'
  },
  scrollContainer: {
    paddingVertical: 20,
    backgroundColor: tuesdaysBlue,
    flex: 1
  },
  square: {
    width: 160,
    height: 100,
    backgroundColor: 'grey',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 1
  },
  rowContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  squareText: {
    color: 'red'
  },
  comedianText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 24,
    paddingBottom: 20
  }
})
  
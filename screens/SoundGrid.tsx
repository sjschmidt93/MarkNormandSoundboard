import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from "react-native"
import { NavigationProps, tuesdaysBlue, SocialRow } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import { Foundation, Ionicons } from '@expo/vector-icons'
import _ from "lodash"
import { observer, inject } from 'mobx-react'
import { observable, reaction, computed } from 'mobx'
import { SoundStore } from "../SoundStore"

export interface SoundStoreProp {
  soundStore: SoundStore
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

  @observable
  playingSound = null

  comedian: string = this.props.navigation.getParam('comedian')

  gridProps = this.comedian === 'Joe List'
    ? joeGridProps
    : markGridProps

  onPressStop = () => this.props.soundStore.sound = null

  render () {
    return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.comedianText}>{this.comedian}</Text>
          <SocialRow />
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
          <PlaybackButtons />
        </View>
      </ScrollView>
    );
  }
}
  
  export interface SquareProps {
    sound: PlaybackSource
    text: String
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
              this.duration = status.playableDurationMillis
            }
          })
      } catch (error) {
        console.warn('Failed to to load' + this.props.sound)
      }
    }
  
    onPress = () => {
      if (!_.isNil(this.props.soundStore.sound)) {
        this.props.soundStore.sound.stopAsync()
      }

      this.props.soundStore.duration = this.duration
      this.props.soundStore.sound = this.sound
      if (this.played) {
        this.sound.replayAsync()
      } else {
        this.sound.playAsync()
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
  
  const CIRCLE_RADIUS = 10

  @inject('soundStore')
  @observer
  class PlaybackButtons extends React.Component<SoundStoreProp> {
    @observable
    paused = false

    @observable
    finished = false

    @observable
    circleX = new Animated.Value(0)

    reaction = reaction(
      () => this.props.soundStore.sound,
      () => this.animateBar()
    )

    @computed
    get showingPlayButton() {
      return this.paused || this.finished
    }

    onPressStop = () => {
      this.props.soundStore.sound.stopAsync()
      this.circleX.setValue(0)
      this.props.soundStore.sound = null
    }

    onPressPause = () => {
      this.props.soundStore.sound.pauseAsync()
      this.paused = true
      this.circleX.stopAnimation(value => this.circleX.setValue(value))
    }

    onPressPlay = () => {
      if (this.paused) {

      } else if (this.finished) {
        this.finished = false
        this.props.soundStore.sound.replayAsync()
        this.animateBar()
      } else {
        this.circleX.setValue(0)
        this.props.soundStore.sound.playAsync()
      }
    }

    onPressPlayPause = () => {
      if (this.showingPlayButton) {
        this.onPressPlay()
      } else {
        this.onPressPause()
      }
      //this.paused = !this.paused
    }

    animateBar = () => {
      this.circleX.setValue(0)
      Animated.timing(
        this.circleX,
        {
          toValue: Dimensions.get('screen').width - 40 - (CIRCLE_RADIUS),
          duration: this.props.soundStore.duration
        }
      ).start()

      setTimeout(() => {
        //this.circleX.setValue(0)
        this.finished = true // it isn't really paused, so use a different var here
        this.paused = false
      }, this.props.soundStore.duration)

    }

    render() {
      if (this.props.soundStore.sound === null) {
        return null
      }

      return (
        <View style={styles.playbackContainer}>
          <View style={styles.playbackButtonsContainer}>
            <TouchableOpacity onPress={this.onPressStop} style={styles.playbackButton}>
              <Foundation name="stop" color="white" size={50} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onPressPlayPause} style={styles.playbackButton}>
              <Ionicons name={this.showingPlayButton ? "md-play" : "md-pause"} color="white" size={50} />
            </TouchableOpacity>
          </View>
          <View style={styles.playbackBarContainer}>
            <Animated.View style={[styles.circle, { transform: [{ translateX: this.circleX }] }]} />
            <View style={styles.playbackBar}>
              <Animated.View style={[styles.completedPlaybackBar, { width: Animated.add(this.circleX, CIRCLE_RADIUS) }]} />
            </View>
          </View>
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    container: {
      paddingBottom: 20
    },
    scrollContainer: {
      paddingVertical: 20,
      backgroundColor: tuesdaysBlue
    },
    playbackButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 20
    },
    playbackButton: {
      paddingHorizontal: 15
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
    },
    playbackContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20
    },
    playbackBar: {
      backgroundColor: 'white',
      height: 4,
      borderRadius: 10
    },
    completedPlaybackBar: {
      position: 'absolute',
      height: 6,
      top: 0,
      left: 0,
      backgroundColor: 'grey',
      borderRadius: 10
    },
    circle: {
      height: CIRCLE_RADIUS * 2,
      width: CIRCLE_RADIUS * 2  ,
      borderRadius: CIRCLE_RADIUS,
      backgroundColor: 'grey',
      position: 'absolute',
      left: 0,
      top: 0,
      zIndex: 5
    },
    playbackBarContainer: {
      height: 10,
      justifyContent: 'center'
    }
  })
  
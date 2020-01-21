import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text, Animated, Dimensions } from "react-native"
import { NavigationProps, tuesdaysBlue } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'
import { markGridProps, joeGridProps } from "../grids"
import { Foundation, Ionicons } from '@expo/vector-icons'
import _ from "lodash"
import { observer, inject } from 'mobx-react'
import { observable, reaction, computed } from 'mobx'
import { SoundStore } from "../SoundStore"
import SocialRow from "../components/SocialRow"

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

  onPressStop = () => this.props.soundStore.sound = null

  render () {
    return (
      <ScrollView style={styles.scrollContainer}>
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
          <PlaybackButtons />
        </View>
      </ScrollView>
    )
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
  
  const CIRCLE_RADIUS = 10
  const ANIMATION_END_VALUE = Dimensions.get('screen').width - 40 - (CIRCLE_RADIUS)

  @inject('soundStore')
  @observer
  class PlaybackButtons extends React.Component<SoundStoreProp> {
    @observable
    paused = false

    @observable
    finished = false

    animationStopValue = -1

    @observable
    circleX = new Animated.Value(0)

    reaction = reaction(
      () => this.props.soundStore.sound,
      () => this.animateBar()
    )

    componentDidMount() {
      this.props.soundStore.animateBar = this.animateBar
    }

    @computed
    get showingPlayButton() {
      return this.paused || this.finished
    }

    onPressStop = () => {
      this.props.soundStore.stop()
      this.circleX.setValue(0)
      this.props.soundStore.stop()
    }

    onPressPause = () => {
      this.props.soundStore.pause(status => {
        if (status.isLoaded) {
          this.paused = true
          this.circleX.stopAnimation(value => {
            this.circleX.setValue(value)
            this.animationStopValue = value
          })
        }
      })
    }

    onPressPlay = () => {
      if (this.paused) {
        this.unpause()
      } else {
        this.replay()
      }
    }

    replay = () => {
      this.finished = false
      this.props.soundStore.sound.replayAsync()
      this.animateBar()
    }

    unpause = () => {
      this.props.soundStore.play()
      this.paused = false
      console.log(this.animationStopValue)
      Animated.timing(
        this.circleX,
        {
          toValue: ANIMATION_END_VALUE,
          duration: this.props.soundStore.duration * (1 - this.animationStopValue / ANIMATION_END_VALUE)
        }
      ).start(result => this.finished = result.finished)
    }

    onPressPlayPause = () => {
      if (this.showingPlayButton) {
        this.onPressPlay()
      } else {
        this.onPressPause()
      }
    }

    animateBar = () => {
      this.finished = false
      this.circleX.setValue(0)
      Animated.timing(
        this.circleX,
        {
          toValue: ANIMATION_END_VALUE,
          duration: this.props.soundStore.duration
        }
      ).start(result => this.finished = result.finished)

    }

    render() {
      if (_.isNil(this.props.soundStore.sound)) {
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
      paddingBottom: 20,
      flex: 1
    },
    scrollContainer: {
      paddingVertical: 20,
      backgroundColor: tuesdaysBlue,
      flex: 1
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
  
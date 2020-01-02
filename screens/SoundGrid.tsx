import React from "react"
import { ScrollView, View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { NavigationProps, tuesdaysBlue } from "./CharacterSelect"
import { PlaybackSource } from "expo-av/build/AV"
import { Audio } from 'expo-av'

const markGridProps: SquareProps[][] = [
  [
    { 
      sound: require('./../assets/sounds/praise_allah.mp3'),
      text: 'Praise Allah!'
    },
    {
      sound: require('./../assets/sounds/i_love_it.mp3'),
      text: 'I love it!!'
    }
  ],
  [
    {
      sound: null,
      text: 'M2A'
    },
    {
      sound: null,
      text: 'M2B'
    }
  ], [
    {
      sound: null,
      text: 'M3A'
    },
    {
      sound: null,
      text: 'M3B'
    }
  ]
]

const joeGridProps = [
  [
    {
      sound: null,
      text: 'J2A'
    },
    {
      sound: null,
      text: 'J2B'
    }
  ],
  [
    {
      sound: null,
      text: 'J3A'
    },
    {
      sound: null,
      text: 'J3B'
    }
  ]
]

  
 export default class SoundGrid extends React.Component<NavigationProps> {
  static navigationOptions = {
    headerStyle: { 
      backgroundColor: tuesdaysBlue
    }
  }

   comedian: string = this.props.navigation.getParam('comedian')

    gridProps = this.comedian === 'Joe List'
      ? joeGridProps
      : markGridProps
  
    render () {
      return (
        <ScrollView style={styles.scrollContainer}>
          <View>
            <Text style={styles.comedianText}>{this.comedian}</Text>
            <View>
              {
                this.gridProps.map((props, index) =>
                  <Row key={index} squareProps={props} />
                )
              }
            </View>
          </View>
        </ScrollView>
      );
    }
  }
  
  interface SquareProps {
    sound: PlaybackSource
    text: String
  }
  
  interface SquareState {
    played: boolean
  }
  
  class Square extends React.Component<SquareProps, SquareState> {
    sound = new Audio.Sound()
  
    componentDidMount() {
      this.state = { played: false }
      this.loadAudio()
    }
  
    loadAudio = async () => {
      try {
        await this.sound.loadAsync(this.props.sound)
      } catch (error) {
        console.warn('Failed to to load' + this.props.sound)
      }
    }
  
    onPress = () => {
      if (this.state.played) {
        this.sound.replayAsync()
      } else {
        this.sound.playAsync()
        this.state = { played: true }
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
  
  interface RowProps {
    squareProps: SquareProps[]
  }
  
  class Row extends React.Component<RowProps> {
    render() {
      return (
        <View style ={styles.markRowContainer}>
          {
            this.props.squareProps.map((props, index) => 
              <Square key={index} {...props} />
            )
          }
        </View>
      )
    }
  }

  const styles = StyleSheet.create({
    scrollContainer: {
      paddingVertical: 20,
      backgroundColor: tuesdaysBlue
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
    markRowContainer: {
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
  
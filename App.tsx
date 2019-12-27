import React from 'react'
import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { Audio } from 'expo-av'
import { PlaybackSource } from 'expo-av/build/AV'

export default class App extends React.Component {
  render () {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MarkRow markSquareProps={[
              { 
                sound: require('./assets/sounds/praise_allah.mp3'),
                text: 'Praise Allah!'
              },
              {
                sound: require('./assets/sounds/i_love_it.mp3'),
                text: 'I love it!'
              }
            ]} 
          />
        </View>
      </ScrollView>
    );
  }
}

interface MarkSquareProps {
  sound: PlaybackSource
  text: String
}

interface MarkSquareState {
  played: boolean
}

class MarkSquare extends React.Component<MarkSquareProps, MarkSquareState> {
  audioObject = new Audio.Sound()

  componentDidMount() {
    this.state = { played: false }
    this.loadAudio()
  }

  loadAudio = async () => {
    try {
      const sound = `./assets/sounds/praise_allah.mp3`
      await this.audioObject.loadAsync(this.props.sound)
    } catch (error) {
      console.warn('Failed to to load' + this.props.sound)
    }
  }

  onPress = () => {
    if (this.state.played) {
      this.audioObject.replayAsync()
    } else {
      this.audioObject.playAsync()
      this.state = { played: true }
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} style={styles.markSquare}>
        <Text style={styles.markSquareText}>{this.props.text}</Text>
      </TouchableOpacity>
    )
  }
}

interface MarkRowProps {
  markSquareProps: MarkSquareProps[]
}

class MarkRow extends React.Component<MarkRowProps> {
  render() {
    return (
      <View style ={styles.markRowContainer}>
        {
          this.props.markSquareProps.map((props, index) => 
            <MarkSquare key={index} {...props} />
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    backgroundColor: 'grey',
  },
  markSquare: {
    width: 160,
    height: 100,
    backgroundColor: 'navy',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  markRowContainer: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  markSquareText: {
    color: 'red'
  }
});

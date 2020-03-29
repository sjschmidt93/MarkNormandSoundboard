import React from "react"
import { LinearGradient } from "expo-linear-gradient"
import { StyleProp, ViewStyle, TextStyle, Text, TouchableOpacity, StyleSheet } from "react-native"

interface GradientButtonProps {
  text: string
  onPress: () => void
  colors?: string[]
  containerStyle?: StyleProp<ViewStyle>
  textStyle?: StyleProp<TextStyle>
}

export const GRADIENT_BUTTON_HEIGHT = 55

const DEFAULT_COLOR_ONE = '#7C98B3'
const DEFAULT_COLOR_TWO = '#637081'

// TODO:: make other instances of gradient buttons use this
export default class GradientButton extends React.Component<GradientButtonProps> {
  static defaultProps = {
    colors: [DEFAULT_COLOR_ONE, DEFAULT_COLOR_TWO]
  }

  render() {
    return (
      <LinearGradient
        start={[0, 1]}
        end={[1, 0]}
        colors={this.props.colors}
        style={[styles.container, this.props.containerStyle]}
      >
        <TouchableOpacity onPress={this.props.onPress}>
          <Text style={[styles.text, this.props.textStyle]}>
            {this.props.text}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    )    
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 17,
    height: GRADIENT_BUTTON_HEIGHT,
    justifyContent: 'center'
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16
  }
})

import React from "react"
import { NavigationProps, navigationOptions, tuesdaysBlue } from "./CharacterSelect"
import { View, StyleSheet, Text, TextInput, TextInputProps, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react"
import { observable, action } from "mobx"
import GradientButton from "../components/GradientButton"

const TOP_TEXT = "If there is an audio clip you would like to see in the app, you can \
submit a suggestion below. Just input a description of the audio, \
the episode number and timestamp."

@observer
export default class SuggestionPage extends React.Component<NavigationProps> {
  static navigationOptions = {...navigationOptions, title: "Make a suggestion" }

  @observable
  description = ""

  @observable
  episodeNumber = ""

  @observable
  timestamp = ""

  onPressSubmit = () => {
    this.clearFields()
    this.props.navigation.goBack()
  }

  @action
  clearFields = () => {
    this.description = ""
    this.episodeNumber = ""
    this.timestamp = ""
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {TOP_TEXT}
        </Text>
        <SuggestionTextInput
            textInputProps={{
              value: this.description,
              placeholder: "Description",
              onChangeText: text => this.description = text
            }}
        />
        <View style={styles.inputRowContainer}>
          <SuggestionTextInput
            textInputProps={{
              value: this.episodeNumber,
              placeholder: "Episode number",
              onChangeText: text => this.episodeNumber = text,
              keyboardType: "numeric",
              maxLength: 3
            }}
            containerStyle={{ marginRight: 10 }}
          />
          <SuggestionTextInput
            textInputProps={{
              value: this.timestamp,
              placeholder: "Timestamp (hh:mm:ss)",
              onChangeText: text => this.timestamp = text
            }}
          />
        </View>
        <GradientButton
          text="Submit"
          onPress={this.onPressSubmit}
        />
      </View>
    )
  }
}

interface SuggestionTextInputProps {
  textInputProps: TextInputProps
  containerStyle?: StyleProp<ViewStyle>
}

class SuggestionTextInput extends React.Component<SuggestionTextInputProps> {
  render() {
    return (
      <View style={[styles.inputContainer, this.props.containerStyle]}>
        <TextInput {...this.props.textInputProps} style={{ color: 'white' }} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tuesdaysBlue,
    padding: 20
  },
  inputRowContainer: {
    flexDirection: 'row'
  },
  inputContainer: {
    backgroundColor: 'grey',
    padding: 5,
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginBottom: 10
  },
  text: {
    color: 'white',
    paddingBottom: 20
  }
})

import React from "react"
import { NavigationProps, navigationOptions, tuesdaysBlue } from "./CharacterSelect"
import { View, StyleSheet, Text, TextInput, TextInputProps, StyleProp, ViewStyle, Alert } from "react-native"
import { observer } from "mobx-react"
import { observable, action } from "mobx"
import GradientButton from "../components/GradientButton"
import API, { graphqlOperation } from '@aws-amplify/api'
import { createSuggestion } from "../src/graphql/mutations"

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

  @observable
  isSuccess = true

  @action
  onPressSubmit = async () => {
    if (this.validateFields()) {
      const suggestion = {
        description: this.description,
        episodeNumber: this.episodeNumber,
        timestamp: this.timestamp
      }

      API.graphql(graphqlOperation(createSuggestion, { input: suggestion }))
        .then(() => this.isSuccess = true)
        .catch(e => {
          console.log('Error when creating suggestion', e)
          Alert.alert('Sorry there was an error. Please try again.')
        })
  
      await API.graphql(graphqlOperation(createSuggestion, { input: suggestion }))
  
      this.clearFields()
    }
  }

  @action
  onPressSubmitAgain = () => this.isSuccess = false

  @action
  onPressBackToBoard = () => this.props.navigation.goBack()

  validateFields = () => {
    const invalidDescription = this.description === ""
    const invalidEpisodeNumber = this.episodeNumber === ""
    const invalidTimestamp = this.timestamp === ""

    const isInvalid = [invalidDescription, invalidEpisodeNumber, invalidTimestamp]

    if (isInvalid.every(valid => !valid)) {
      return true
    }

    const invalidFields = ["description", "episode number", "timestamp"]
                            .filter((_, index) => isInvalid[index])
                            .join(", ")

    const isOrAre = invalidFields.length > 1 ? "are" : "is"
    const fieldOrFields = invalidFields.length > 1 ? "fields" : "field"

    Alert.alert(
      `Empty ${fieldOrFields}`,
      `The following ${fieldOrFields} ${isOrAre} empty: ${invalidFields}.`,
      [
        { text: 'OK' }
      ]
    )

    return false
  }

  @action
  clearFields = () => {
    this.description = ""
    this.episodeNumber = ""
    this.timestamp = ""
  }

  render() {
    const success = (
      <>
        <Text style={styles.text}>
          Success! Thanks for your submission.
        </Text>
        <GradientButton
          text="Back to soundboard"
          onPress={this.onPressBackToBoard}
          containerStyle={{ marginBottom: 20 }}
        />
        <GradientButton
          text="Make another submission"
          onPress={this.onPressSubmitAgain}
        />
      </>
    )

    const inputs = (
      <>
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
      </>
    )

    return (
      <View style={styles.container}>
        {this.isSuccess ? success : inputs}
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
        <TextInput {...this.props.textInputProps} style={{ color: 'white', fontSize: 16 }} />
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
  statusContainer: {
    backgroundColor: 'green',
    width: 250,
    padding: 5,
    paddingHorizontal: 10,
    margin: 5,
    borderRadius: 5
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
    paddingBottom: 20,
    fontSize: 16
  }
})

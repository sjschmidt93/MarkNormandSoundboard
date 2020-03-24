import React from "react"
import { View, StyleSheet, Linking } from "react-native"
import { SocialIcon } from "react-native-elements"
import { computed } from "mobx"
import { Comedian } from "../screens/SoundGrid"

interface SocialRowProps {
  comedian: Comedian
}

export default class SocialRow extends React.Component<SocialRowProps> {
  @computed
  get twitter() {
    return this.props.comedian === Comedian.MARK
      ? 'https://twitter.com/marknorm'
      : 'https://twitter.com/JoeListComedy'
  }

  @computed
  get facebook() {
    return this.props.comedian === Comedian.MARK
      ? 'https://www.facebook.com/pages/category/Comedian/Mark-Normand-21895626989/'
      : 'https://www.facebook.com/comedianjoelist/'
  }

  @computed
  get instagram() {
    return this.props.comedian === Comedian.MARK
      ? 'https://www.instagram.com/marknormand/'
      : 'https://www.instagram.com/joelistcomedy/'
  }

  render() {
    return (
      <View style={styles.container}>
        <SocialIcon type="instagram" onPress={() => Linking.openURL(this.instagram)} />
        <SocialIcon type="facebook" onPress={() => Linking.openURL(this.facebook)} />
        <SocialIcon type="twitter" onPress={() => Linking.openURL(this.twitter)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 60,
    paddingBottom: 20
  }
})

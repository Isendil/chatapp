import React, { Component } from "react";
import KeyboardSpacer from "react-native-keyboard-spacer";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "" }; // creates state for"name" and "color"
  }
  render() {
    return (
      <ImageBackground
        source={require("../assets/BackgroundImage.png")}
        style={styles.backgroundImage}
      >
        <Text style={styles.appTitle}>Mad Chatter</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.nameBox}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder="Enter Name"
            placeholderTextColor={"black"}
          />
          <Text style={styles.title}>Choose your background colour:</Text>
          <View style={styles.colorBackground}>
            <TouchableOpacity
              onPress={() => this.setState({ color: "#090C08" })}
              style={[styles.color1, styles.colorButton]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: "#474056" })}
              style={[styles.color2, styles.colorButton]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: "#8A95A5" })}
              style={[styles.color3, styles.colorButton]}
            />
            <TouchableOpacity
              onPress={() => this.setState({ color: "#B9C6AE" })}
              style={[styles.color4, styles.colorButton]}
            />
          </View>
          <Button
            style={styles.button}
            title="Start Chatting"
            onPress={() =>
              this.props.navigation.navigate("Chat", {
                name: this.state.name,
                color: this.state.color,
              })
            }
          />
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "88%",
    fontSize: 16,
    height: "44%",
    color: "#000",
    marginBottom: 20,
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  nameBox: {
    fontSize: 22,
    fontWeight: "800",
    borderWidth: 4,
    color: "#000000",
    borderColor: "#757083",
    width: "88%",
    marginBottom: 20,
    marginTop: 30,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    height: 65,
    width: "88%",
    marginBottom: 20,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#757083",
  },
  appTitle: {
    flex: 1,
    fontSize: 45,
    marginTop: 60,
    color: "#FFFFFF",
    fontWeight: "600",
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    marginTop: 15,
    marginLeft: 20,
  },
  title: {
    alignItems: "center",
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  /*========Background Color Options========*/
  colorButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    margin: 10,
  },
  colorBackground: {
    flex: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    margin: 15,
  },
  color1: {
    backgroundColor: "#090C08",
  },
  color2: {
    backgroundColor: "#474056",
  },
  color3: {
    backgroundColor: "#8A95A5",
  },
  color4: {
    backgroundColor: "#B9C6AE",
  },
});

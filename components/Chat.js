import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ImageBackground,
  Platform,
} from "react-native";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";

const firebase = require("firebase");
require("firebase/firestore");

export default class Chat extends Component {
  //pulling in information from Start.js name/color
  static navigationOptions = ({ navigation }) => {
    return {
      name: navigation.state.params.name,
    };
  };

  constructor(props) {
    super(props);

    firebase.initializeApp({
      apiKey: "AIzaSyCm_Yc6MZUjuW3q7PQMmsJXWkIg4Eup-_g",
      authDomain: "test-95ec6.firebaseapp.com",
      databaseURL: "https://test-95ec6.firebaseio.com",
      projectId: "test-95ec6",
      storageBucket: "test-95ec6.appspot.com",
      messagingSenderId: "111540181902",
      appId: "1:111540181902:web:994bd356ac27921517e2df",
      measurementId: "G-22NLXCDQ6Z",
    });
    this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection("messages");
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: 0,
    };
  }

  // Change bubble colour
  renderBubble(props) {
    {
      /* Colour options
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
       https://coolors.co/ */
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: "#8e44ad",
          },
          right: {
            backgroundColor: "#2ecc71",
          },
        }}
      />
    );
  }

  // Set user ID, name and avatar
  setUser = (_id, name = "anonymous") => {
    this.setState({
      user: {
        _id: _id,
        name: name,
        avatar: "https://placeimg.com/140/140/any",
      },
    });
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid,
    };
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        // messages: data.message,
      });
    });
    this.setState({
      messages,
    });
  };

  //adding messages to the database and setting the state of user id
  componentDidMount() {
    // this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
      //update user state with currently active user data
      if (user) {
        //do something
        //now you are sure that tthere is a user in the if statement
      }
      this.setState({
        uid: user.uid,
        loggedInText: "Welcome to Mad Chatter",
      });
      if (user.uid) {
        // Do something
        console.log(user.uid);
      }
      // Will not result in an error
      this.referenceMessageUser = firebase.firestore().collection("messages");

      this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(
        this.onCollectionUpdate
      );
    });
    this.setState({
      messages: [
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        {
          _id: 2,
          text:
            this.props.navigation.state.params.name + " has entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  //unmounting
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribeMessageUser();
  }

  //Adding messages to the database
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || "",
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
    });
  }

  // Send message function
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => this.addMessage()
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: this.props.navigation.state.params.color,
        }}
      >
        <Text> Hello {this.props.navigation.state.params.name}</Text>
        <GiftedChat
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          renderBubble={this.renderBubble.bind(this)}
          user={this.state.user}
        />
        {/* Keyboard spacer for android only. */}
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Sets the width and height of the device
    color: "#FFFFFF",
    backgroundColor: "#000000",
  },
});

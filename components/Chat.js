//  import react component
import React, { Component } from "react";
//import relevant components from react native
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, Text, View, Platform, AsyncStorage } from "react-native";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import KeyboardSpacer from "react-native-keyboard-spacer";
//import custom CustomActions
import CustomActions from "./CustomActions";
//import MapView
import MapView from "react-native-maps";

// create Screen2 (Chat) class
//import firebase
const firebase = require("firebase");
require("firebase/firestore");

// create Screen2 (Chat) class
export default class Chat extends Component {
  constructor() {
    super();

    /**
     * initializing firebase
     * @param {object} firebaseConfig
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectID
     * @param {string} storageBucket
     * @param {string} messagingSenderId
     * @param {string} appId
     */
    // firebase adding credential in order to connect to firebase
    if (!firebase.apps.length) {
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
    }

    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      image: null,
    };
  }

  // temporarly storage of messages
  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // firebase storage
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  // componentDidMount is a "lifecycle method". Lifecycle methods run the
  // function at various times during a component's "lifecycle". For example
  // componentDidMount will run right after the component was added to the page.
  componentDidMount() {
    NetInfo.addEventListener((state) => {
      this.handleConnectivityChange(state);
    });

    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected;
      if (isConnected) {
        this.setState({
          isConnected: true,
        });

        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              uid: user.uid,
              messages: [],
            });

            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false,
        });

        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }

  /**
   * onCollectionUpdte takes snapshot on collection update
   * @function onCollectionUpdate
   * @param {string} _id
   * @param {string} text
   * @param {number} created.At
   * @param {object} user
   * @param {string} user._id
   * @param {string} image
   * @param {object} location
   * @param {number} location.longitude
   * @param {number} location.latitude
   */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || null,
        location: data.location || null,
      });
    });

    this.setState({
      messages,
    });
  };

  /**
   * checks networkstatus of user
   * @function handleConnectivityChange
   */
  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  /**
   * adds the message object to firestore, fired by onSend function
   * @function addMessage
   * @param {string} _id
   * @param {string} text
   * @param {number} created.At
   * @param {object} user
   * @param {string} user._id
   * @param {string} image
   * @param {object} location
   * @param {number} location.longitude
   * @param {number} location.latitude
   */
  addMessage = () => {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  };
  //define title in navigation bar
  static navigationOptions = ({ navigation }) => {
    return {
      title: `${navigation.state.params.userName}'s Chat`,
    };
  };

  /**
   * handles actions when user hits send-button
   * @function onSend
   * @param {object} messages
   */
  onSend = (messages = []) => {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  };

  /**
   * hides inputbar when offline
   * @function renderInputToolbar
   */
  renderInputToolbar = (props) => {
    console.log("renderInputToolbar --> props", props.isConnected);
    if (props.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  /**
   * displays the communication features
   * @function renderCustomActions
   */
  renderCustomActions = (props) => <CustomActions {...props} />;

  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  //render components
  render() {
    return (
      //fullscreen component
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.navigation.state.params.backgroundColor,
        }}
      >
        <GiftedChat
          messages={this.state.messages}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
          }}
        />
        {/* {Platform.OS === "android" ? <KeyboardSpacer /> : null} */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

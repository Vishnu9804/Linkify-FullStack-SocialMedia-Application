import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import logo from "../../../../assets/logo.png";
import { containerFull, hr80, logo1 } from "../../../CommonCss/pagecss";
import {
  formHead,
  formInput,
  formTextLinkCenter,
  formTextLinkRight,
  formbtn,
} from "../../../CommonCss/formcss";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    if (email == "" || password == "") {
      alert("Please enter email and password");
    } else {
      setLoading(true);
      fetch("http://192.168.80.149:3000/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data.error) {
            setLoading(false);
            alert(data.error);
          } else if (data.message == "Successfully Signed In") {
            setLoading(false);
            await AsyncStorage.setItem("user", JSON.stringify(data));
            navigation.navigate("MainPage", { data });
          }
        })
        .catch((err) => {
          setLoading(false);
          alert(err);
        });
    }
    // navigation.navigate('MainPage')
  };
  return (
    <View style={containerFull}>
      <Image source={logo} style={logo1}></Image>
      <Text style={formHead}>Login</Text>

      <TextInput
        placeholder="Enter Your Email"
        style={formInput}
        onChangeText={(text) => setEmail(text)}
      ></TextInput>
      <TextInput
        placeholder="Enter Your Password"
        style={formInput}
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInput>

      <Text
        style={formTextLinkRight}
        onPress={() => navigation.navigate("ForgotPassword_EnterEmail")}
      >
        Forgot Password
      </Text>

      {loading ? (
        <ActivityIndicator size={"large"} color={"white"}></ActivityIndicator>
      ) : (
        <Text style={formbtn} onPress={() => handleLogin()}>
          Submit
        </Text>
      )}
      <View style={hr80}></View>

      <Text style={formTextLinkCenter}>
        Don't Have an Account? {"  "}
        <Text
          style={{
            color: "white",
            textDecorationLine: "underline",
            fontSize: 15,
          }}
          onPress={() => navigation.navigate("Signup_EnterEmail")}
        >
          Signup
        </Text>
      </Text>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({});

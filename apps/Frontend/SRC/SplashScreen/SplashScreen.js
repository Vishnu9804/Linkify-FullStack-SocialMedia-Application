import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      {/* <Text style={styles.text}>Your App Name</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
});

export default SplashScreen;

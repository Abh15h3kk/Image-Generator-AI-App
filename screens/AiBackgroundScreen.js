import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export default function BackgroundRemoverScreen() {
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [inputText, setInputText] = useState("");
  const [showPickImage, setShowPickImage] = useState(true);

  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Please allow access to select images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const generateImage = async () => {
    if (!selectedImage || !inputText.trim()) {
      Alert.alert("Missing Data", "Please select an image and enter a prompt.");
      return;
    }

    setLoading(true);
    setImageData(null);

    let headers = new Headers();
    headers.append("Authorization", "Bearer vk-rJb3gCzORmn3DmYTCdk5DH8ui5YQ5yL9aUqIxrKR0EwDT");

    let formData = new FormData();
    formData.append("prompt", inputText);
    formData.append("image", {
      uri: selectedImage,
      name: "upload.jpg",
      type: "image/jpeg",
    });

    let requestOptions = {
      method: "POST",
      headers,
      body: formData,
    };

    try {
      const response = await fetch("https://api.vyro.ai/v2/image/generations/ai-background", requestOptions);
      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const imageBytes = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(imageBytes);
      setImageData(`data:image/png;base64,${base64}`);
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  return (
    <View style={styles.container}>
      {/* Pick Image Button (Centered, disappears on Send) */}
      {showPickImage && (
        <TouchableOpacity onPress={pickImage} style={styles.pickImageButton}>
          <MaterialIcons name="photo-library" size={35} color="white" />
        </TouchableOpacity>
      )}

      {/* Image Preview or Loading Animation */}
      {!selectedImage && !imageData && !loading ? (
        <LottieView
          source={require("../assets/ani3.json")}
          autoPlay
          loop
          style={styles.animation}
        />
      ) : loading ? (
        <LottieView
          source={require("../assets/animation.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
      ) : imageData ? (
        <Image source={{ uri: imageData }} style={styles.previewImage} />
      ) : (
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
      )}

      {/* Input Bar (Above Animation, Near Bottom) */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Write the prompt here..."
          placeholderTextColor="#bbb"
          color="#fff"
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={generateImage} disabled={loading}>
          <MaterialIcons name="send" size={28} color={loading ? 'gray' : 'blue'} />
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  previewImage: {
    width: "100%",
    height: "60%",
    resizeMode: "contain",
    borderRadius: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 10,
    position: "absolute",
    bottom: 100, // Positioned just above the animation
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: "#1e1e1e",
    width: "90%",
  },
  textInput: {
    flex: 1,
    padding: 10,
    color: "#fff",
  },
  pickImageButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    position: "absolute",
    alignSelf: "center",
    top: "50%", // Centering it vertically
    transform: [{ translateY: -30 }], // Adjusting position slightly
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  animation: {
    width: 800,
    height: 800,
    position: "absolute",
    bottom: 150, // Adjusted so input stays just above
  },
});
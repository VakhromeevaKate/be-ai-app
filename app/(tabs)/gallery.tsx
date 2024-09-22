import { useState, useEffect } from 'react';
import { Pressable, Image, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { i18n } from '@/i18n/gallery.i18n';
import { loadBeModel, runBeModel } from '@/utils/model';
import * as ort from 'onnxruntime-react-native';
import { Colors } from '@/constants/Colors';

export default function Gallery() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<ort.InferenceSession | undefined>();
  const [modelResult, setModelResult] = useState<ort.Tensor | undefined>()

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    try {
      const cameraResp = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
      });

      if (!cameraResp.canceled) {
        setImage(cameraResp.assets[0].uri);
      }
    } catch (error) {
      console.log("Error Uploading Image " + error);
    }
  };


  const cancel = () => {
    setImage(null);
    setModelResult(undefined);
  }

  const saveMeal = () => {
    cancel();
  }

  useEffect(() => {
    loadBeModel().then((response) => setModel(response));
  }, []);

  const inferenceModel = async () => {
    try {
      setLoading(true);
      if (!model) return;
      const result = await runBeModel(model);
      setModelResult(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const renderContent = () => (
    <>
      {!image && <Pressable style={styles.button} onPress={pickImage}>
          <Text>{i18n.t('pickAnImage')}</Text>
        </Pressable>
      }
      {!image && 
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text>{i18n.t('takePhoto')}</Text>
        </Pressable>}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image &&
        <Pressable style={styles.button} onPress={inferenceModel}>
          <Text>{i18n.t('recognizeImage')}</Text>
        </Pressable>
      }
      {image && <Pressable style={styles.button} onPress={cancel}>
          <Text>{i18n.t('cancel')}</Text>
        </Pressable>
      }
      {image && modelResult && <Pressable style={styles.button} onPress={saveMeal}>
          <Text>{i18n.t('saveMeal')}</Text>
      </Pressable>
      }
      {modelResult && <Text>{modelResult.dims}</Text>}
    </>
  );

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator /> : renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  button: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: Colors.light.tabIconDefault,
    color: Colors.dark.text,
    width: "80%",
    margin: 20,
    padding: 12
  }
});

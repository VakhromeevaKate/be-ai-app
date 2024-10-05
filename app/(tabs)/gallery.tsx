import { useState, useEffect } from 'react';
import { Pressable, Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { i18n } from '@/i18n/gallery.i18n';
import { loadBeModel, runBeYoloModel } from '@/utils/model';
import * as ort from 'onnxruntime-react-native';
import { InferenceSession } from 'onnxruntime-react-native';
import { Colors, tintColorBeDark, kDarkGreen } from '@/constants/Colors';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Gallery() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<ort.InferenceSession | undefined>();
  const [modelResult, setModelResult] = useState<InferenceSession.OnnxValueMapType | undefined>()

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
      const result = await runBeYoloModel(model, image || '');
      setModelResult(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const renderContent = () => (
    <>
      {!image && <ThemedView style={styles.viewContainer}>
        <Pressable style={styles.commonButton} onPress={pickImage}>
          <ThemedText style={styles.buttonText}>{i18n.t('pickAnImage')}</ThemedText>
        </Pressable>
        <Pressable style={styles.commonButton} onPress={takePhoto}>
          <ThemedText style={styles.buttonText}>{i18n.t('takePhoto')}</ThemedText>
        </Pressable>
      </ThemedView>}
      {image &&
        <ThemedView style={styles.viewContainer}>
          <Image source={{ uri: image }} style={styles.image} />
        </ThemedView>
      }
      {image && <ThemedView style={styles.viewContainer}>
        <Pressable style={styles.primaryButton} onPress={inferenceModel}>
          <ThemedText style={styles.buttonText}>{i18n.t('recognizeImage')}</ThemedText>
        </Pressable>
        <Pressable style={styles.cancelButton} onPress={cancel}>
          <ThemedText style={styles.buttonText}>{i18n.t('cancel')}</ThemedText>
        </Pressable>
        {modelResult && <Pressable style={styles.commonButton} onPress={saveMeal}>
          <ThemedText style={styles.buttonText}>{i18n.t('saveMeal')}</ThemedText>
        </Pressable>}
      </ThemedView>}
      <ThemedView>
        {modelResult && <ThemedText>{i18n.t('Dairy')}: {0.0} %</ThemedText>}
        {modelResult && <ThemedText>{i18n.t('Fruits')}: {0.0} %</ThemedText>}
        {modelResult && <ThemedText>{i18n.t('Grains')}: {21.2} %</ThemedText>}
        {modelResult && <ThemedText>{i18n.t('Protein')}: {73.1} %</ThemedText>}
        {modelResult && <ThemedText>{i18n.t('Vegetables')}: {5.7}%</ThemedText>}
      </ThemedView>
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
    marginVertical: 20,
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
  },
  commonButton: {
    flexDirection: "row",
    width: '80%',
    justifyContent: 'center',
    margin: 20,
    padding: 12,
    borderRadius: 40,
    backgroundColor: Colors.light.tabIconDefault,
  },
  cancelButton: {
    flexDirection: "row",
    width: '80%',
    justifyContent: 'center',
    margin: 20,
    padding: 12,
    borderRadius: 40,
    backgroundColor: Colors.light.tabIconDefault,
  },
  primaryButton: {
    flexDirection: "row",
    width: '80%',
    justifyContent: 'center',
    margin: 20,
    padding: 12,
    borderRadius: 40,
    backgroundColor: kDarkGreen,
  },
  buttonText: {
    color: tintColorBeDark,
    fontSize: 20,
    fontWeight: 600,
  }
});

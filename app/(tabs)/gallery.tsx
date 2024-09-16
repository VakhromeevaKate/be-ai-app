import { useState, useEffect } from 'react';
import { Button, Image, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { i18n } from '@/i18n/gallery.i18n';
import { loadBeModel, runBeModel } from '@/utils/model';
import * as ort from 'onnxruntime-react-native';

export default function Gallery() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [model, setModel] = useState<ort.InferenceSession | undefined>();
  const [modelResult, setModalResult] = useState<ort.Tensor | undefined>()

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

  useEffect(() => {
    loadBeModel().then((response) => setModel(response));
  }, []);

  const inferenceModel = async () => {
    try {
      setLoading(true);
      if (!model) return;
      const result = await runBeModel(model);
      setModalResult(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const renderContent = () => (
    <>
      {!image && <Button title={i18n.t('pickAnImage')} onPress={pickImage} />}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <Button title={i18n.t('recognizeImage')} onPress={inferenceModel} />}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

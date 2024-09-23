import { InferenceSession, type Tensor } from "onnxruntime-react-native";
import * as FileSystem from 'expo-file-system';
import * as ort from 'onnxruntime-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { decode as decodeImage } from 'base64-arraybuffer';

// load a model
export const getONNXSession = async(modelPath: string) => {
    const session: InferenceSession = await InferenceSession.create(modelPath);
    return session;
}

// input as InferenceSession.OnnxValueMapType
export const startONNXSession = async(session: InferenceSession, input: any) => {
    const result = await session.run(input, ['num_detection:0', 'detection_classes:0']);
    return result;
}

export const imageToFloatTensor = async(imageUri: string, width: number = 640, height: number = 640): Promise<Float32Array> => {
    const tensorData = new Float32Array(3 * width * height);
    console.log('tensorData', 3 * width * height);
    // Шаг 1: Загрузить изображение
    const imageAsset = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const jpegData = decodeImage(imageAsset);
    console.log({jpegData});

    // Шаг 2: Изменить размер до заданного
    const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width, height } }],
        { base64: true }
    );
    console.log({imageHeight: resizedImage.height, imageWidth: resizedImage.width});
    if (resizedImage && resizedImage.base64) {
        // Декодируем измененное изображение
        const resizedImageData = decodeImage(resizedImage.base64);
            
        // Шаг 3: Нормализуем пиксели и создаем тензор
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const index = (i * width + j) * 4; // 4 - это RGBA
                // Получаем значения R, G, B
                // @ts-ignore
                tensorData[0 * width * height + i * width + j] = resizedImageData[index] / 255; // R
                // @ts-ignore
                tensorData[1 * width * height + i * width + j] = resizedImageData[index + 1] / 255; // G
                // @ts-ignore
                tensorData[2 * width * height + i * width + j] = resizedImageData[index + 2] / 255; // B
            }
        }
    }

    return tensorData;
}


export const floatTensorToImage = () => {}

export const getUint8ArrayFromUri = async (uri: string): Promise<Uint8Array> => {
    try {
        const fileContent = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const buffer = Buffer.from(fileContent, 'base64');
        return new Uint8Array(buffer);
    } catch (error) {
        console.error(error);
        return new Uint8Array();
    }
};

export const getTensorFromUint8Array = async (uri: string) => {
    const imageUint8ArrayData = await getUint8ArrayFromUri(uri);
    const dataLength = imageUint8ArrayData.length;
    return new ort.Tensor(imageUint8ArrayData, [dataLength]);
}
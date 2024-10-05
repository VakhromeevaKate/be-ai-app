import { InferenceSession } from "onnxruntime-react-native";
import * as FileSystem from 'expo-file-system';
import * as ort from 'onnxruntime-react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as tf from "@tensorflow/tfjs";

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

export const imageToUin8Tensor = async (imageUri: string, width: number = 640, height: number = 640): Promise<Uint8Array> => {
    try {
        // Изменить размер до заданного
        const resizedImage = await ImageManipulator.manipulateAsync(
            imageUri,
            [{ resize: { width, height } }],
            { base64: true }
        );

        // Получаем итоговое изображение в формате base64
        const base64Image = resizedImage.base64;

        // Преобразуем base64 изображение в Uint8Array
        const binaryString = atob(base64Image || '');
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const resultTensor = new Uint8Array(3 * height * width);
        for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4; // 4 канала (RGBA)
            const targetIndex = (i * width + j) * 3; // 3 канала (RGB)

            resultTensor[targetIndex] = bytes[index];         // R
            resultTensor[targetIndex + 1] = bytes[index + 1]; // G
            resultTensor[targetIndex + 2] = bytes[index + 2]; // B
        }
    }

    return resultTensor;
    } catch (error) {
        console.error("Error converting image:", error);
        throw new Error("Image conversion failed.");
    }
};

export const imageToFloatTensor = async(imageUri: string, width: number = 640, height: number = 640): Promise<Float32Array> => {
    await tf.ready();
    // Шаг 1: Создаем тензор нужного размера
    const tensorData = new Float32Array(3 * height * width);

    // Шаг 2: Изменить размер изображения до заданного
    const resizedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width, height } }],
        { base64: true }
    );

    // Шаг 3: Преобразуем base64 изображение в Uint8Array
    const base64Image = resizedImage.base64;
    const binaryString = atob(base64Image || '');
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    const imageTensor = await decodeJpeg(bytes);
    // console.log('imageTensor:', { shape: imageTensor.shape, dtype: imageTensor.dtype })
    // imageTensor.print()
    const bytesArr = imageTensor.dataSync();

    // Шаг 4: Нормализуем пиксели и создаем тензор
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = (i * width + j) * 4; // 4 - это RGBA
            // Получаем значения R, G, B
            // @ts-ignore
            tensorData[0 * height * width + i * width + j] = (bytesArr[index]) / 255; // R
            // @ts-ignore
            tensorData[1 * height * width + i * width + j] = (bytesArr[index + 1]) / 255; // G
            // @ts-ignore
            tensorData[2 * height * width + i * width + j] = (bytesArr[index + 2]) / 255; // B
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
import { Asset } from 'expo-asset';
import * as ort from 'onnxruntime-react-native';
import { InferenceSession } from "onnxruntime-react-native";
import { imageToFloatTensor, imageToUin8Tensor } from './onnx';

export async function loadModel() {
    let myModel: InferenceSession;
    try {
        const assets = await Asset.loadAsync(require('@/assets/models/mnist.ort'));
        const modelUri = assets[0].localUri;
        if (!modelUri) {
        console.log('failed to get model URI', `${assets[0]}`);
        } else {
        myModel = await ort.InferenceSession.create(modelUri);
        console.log(
            'model loaded successfully',
            `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`);
        }
    } catch (e) {
        console.log('failed to load model', `${e}`);
        throw e;
    }
}

export async function loadBeModel(): Promise<InferenceSession | undefined> {
    let myModel: InferenceSession;
    try {
        const assets = await Asset.loadAsync(require('@/assets/models/model.onnx'));
        const modelUri = assets[0].localUri;
        if (!modelUri) {
        console.log('failed to get model URI', `${assets[0]}`);
        return undefined
        } else {
        myModel = await InferenceSession.create(modelUri);
        console.log(
            'model loaded successfully',
            `input names: ${myModel.inputNames}, output names: ${myModel.outputNames}`);
        }
        return myModel;
    } catch (e) {
        console.log('failed to load model', `${e}`);
        throw e;
    }
}

export async function runModel(myModel: InferenceSession) {
    try {
        const inputData = new Float32Array(28 * 28);
        const feeds:Record<string, ort.Tensor> = {};
        feeds[myModel.inputNames[0]] = new ort.Tensor(inputData, [1, 28, 28]);
        const fetches = await myModel.run(feeds);
        const output = fetches[myModel.outputNames[0]];
        if (!output) {
        console.log('failed to get output', `${myModel.outputNames[0]}`);
        } else {
        console.log(
            'Mnist model inference successfully',
            `output shape: ${output.dims}, output data: ${output.data}`);
        }
    } catch (e) {
        console.log('failed to inference model', `${e}`);
        throw e;
    }
}

export async function runBeModel(myModel: InferenceSession): Promise<ort.Tensor | undefined> {
    try {
        const inputData = new Float32Array(1 * 3 * 512 * 512);
        const feeds:Record<string, ort.Tensor> = {};
        feeds[myModel.inputNames[0]] = new ort.Tensor(inputData, [1, 3, 512, 512]);
        console.log('runBeModel feeds:', feeds['input0'].size);
        const fetches = await myModel.run(feeds);
        const output = fetches[myModel.outputNames[0]];
        if (!output) {
        console.log('failed to get output', `${myModel.outputNames[0]}`);
        } else {
        console.log(
            'Be model inference successfully' //, `output shape: ${output.dims}, output data: ${output.data}`
            );
        }
        return output;
    } catch (e) {
        console.log('failed to inference model', `${e}`);
        throw e;
    }
}

export async function runBeYoloModel(myModel: InferenceSession, imagePath: string): Promise<InferenceSession.OnnxValueMapType | undefined> {
    try {
        const inputData = await imageToFloatTensor(imagePath);
        const feeds:Record<string, ort.Tensor> = {};
        feeds[myModel.inputNames[0]] = new ort.Tensor(inputData, [1, 3, 640, 640]);
        // console.log('myModel names:', myModel?.names);
        // console.log('myModel metadata:', myModel?.names);

        const fetches = await myModel.run(feeds);
        const output = fetches[myModel.outputNames[0]];

        console.log({
            output: output.data.length,
            cpuData: output.data[0],
            dataLocation: output?.location,
            type: output.type,
            dims: output.dims,
            size: output.size,
        })

        if (!output) {
            console.log('failed to get output', `${myModel.outputNames[0]}`);
        } else {
            console.log('Be model inference successfully', `output shape: ${output.dims}`); //, output data: ${output.data}`);
        }
        console.log('fetches', Object.keys(fetches.output0))
        console.log('fetches', Object.keys(fetches.output1))
        console.log('fetches', fetches)
        return fetches;
    } catch (e) {
        console.log('failed to inference model', `${e}`);
        throw e;
    }
}
import fs from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const modelRegistry = {
  plantvillageResNet50: {
    modelPath: 'models/plant_disease_model_v2.onnx',
    labelsPath: 'models/plantvillage-labels.json',
    externalDataPath: 'models/plant_disease_model_v2.onnx.data',
    modelPathEnv: 'CROP_DISEASE_MODEL_PATH',
    labelsPathEnv: 'CROP_DISEASE_LABELS_PATH',
    externalDataPathEnv: 'CROP_DISEASE_MODEL_DATA_PATH',
    modelVersion: 'plantvillage-resnet50-v2',
  },
  ixrGrapeConvNext: {
    modelPath: 'models/grape-convnext.onnx',
    labelsPath: 'models/grape-labels.json',
    externalDataPath: null,
    modelPathEnv: 'CROP_DISEASE_GRAPE_MODEL_PATH',
    labelsPathEnv: 'CROP_DISEASE_GRAPE_LABELS_PATH',
    externalDataPathEnv: 'CROP_DISEASE_GRAPE_MODEL_DATA_PATH',
    modelVersion: 'ixrbhii-grape-disease-convnext',
  },
  ixrSoybeanConvNext: {
    modelPath: 'models/soybean-convnext.onnx',
    labelsPath: 'models/soybean-labels.json',
    externalDataPath: null,
    modelPathEnv: 'CROP_DISEASE_SOYBEAN_MODEL_PATH',
    labelsPathEnv: 'CROP_DISEASE_SOYBEAN_LABELS_PATH',
    externalDataPathEnv: 'CROP_DISEASE_SOYBEAN_MODEL_DATA_PATH',
    modelVersion: 'ixrbhii-soybean-disease-convnext',
  },
};
const cropAdapterRegistry = {
  tomato: { model: 'plantvillageResNet50', outputCrop: 'tomato' },
  potato: { model: 'plantvillageResNet50', outputCrop: 'potato' },
  pepper: { model: 'plantvillageResNet50', outputCrop: 'pepper' },
  grape: { model: 'ixrGrapeConvNext', outputCrop: 'grape' },
  soybean: { model: 'ixrSoybeanConvNext', outputCrop: 'soybean' },
};
const cachedModels = new Map();
let cachedImageProcessor;

export function getDiagnosisConfig(crop) {
  const configuredThreshold = Number(process.env.CROP_DIAGNOSIS_MIN_CONFIDENCE);
  const minimumConfidence = Number.isFinite(configuredThreshold)
    && configuredThreshold >= 0
    && configuredThreshold <= 1
    ? configuredThreshold
    : 0.8;
  const adapter = crop ? cropAdapterRegistry[crop] : cropAdapterRegistry.tomato;
  const definition = adapter ? modelRegistry[adapter.model] : null;
  const modelPath = process.env[definition?.modelPathEnv] || definition?.modelPath || 'models/model.onnx';
  const labelsPath = process.env[definition?.labelsPathEnv] || definition?.labelsPath || 'models/labels.json';
  const externalDataPath = process.env[definition?.externalDataPathEnv] || definition?.externalDataPath;

  return {
    modelId: adapter?.model || null,
    expectedCrop: adapter?.outputCrop || null,
    modelPath: path.resolve(projectRoot, modelPath),
    labelsPath: path.resolve(projectRoot, labelsPath),
    externalDataPath: externalDataPath ? path.resolve(projectRoot, externalDataPath) : null,
    modelVersion: definition?.modelVersion || 'unavailable',
    minimumConfidence,
  };
}

export function getModelBackedCrops() {
  return Object.keys(cropAdapterRegistry);
}

export function isDiagnosisConfigured(crop) {
  const crops = crop ? [crop] : getModelBackedCrops();
  return crops.some((candidate) => {
    const config = getDiagnosisConfig(candidate);
    return Boolean(config.modelId)
      && fs.existsSync(config.modelPath)
      && fs.existsSync(config.labelsPath)
      && (!config.externalDataPath || fs.existsSync(config.externalDataPath));
  });
}

async function loadModel(config) {
  const [ort, labels, modelBytes, externalDataBytes] = await Promise.all([
    import('onnxruntime-web/wasm'),
    readFile(config.labelsPath, 'utf8').then(JSON.parse),
    readFile(config.modelPath),
    config.externalDataPath ? readFile(config.externalDataPath) : Promise.resolve(null),
  ]);

  if (!Array.isArray(labels.classes) || !labels.classes.length) {
    throw new Error('The model class manifest is missing or empty.');
  }
  if (labels.classes.some((item) => !item.key || !item.crop || !item.name?.en || !item.name?.mr || !item.name?.hi)) {
    throw new Error('The model class manifest is incomplete.');
  }

  const wasmModulePath = fileURLToPath(import.meta.resolve('onnxruntime-web/wasm'));
  const wasmBinary = await readFile(path.join(path.dirname(wasmModulePath), 'ort-wasm-simd-threaded.wasm'));
  ort.env.wasm.wasmBinary = new Uint8Array(wasmBinary.buffer, wasmBinary.byteOffset, wasmBinary.byteLength);
  ort.env.wasm.numThreads = 1;

  const sessionOptions = { executionProviders: ['wasm'] };
  if (externalDataBytes) {
    sessionOptions.externalData = [{
        path: path.basename(config.externalDataPath),
        data: new Uint8Array(externalDataBytes.buffer, externalDataBytes.byteOffset, externalDataBytes.byteLength),
    }];
  }
  const session = await ort.InferenceSession.create(
    new Uint8Array(modelBytes.buffer, modelBytes.byteOffset, modelBytes.byteLength),
    sessionOptions,
  );

  const inputMetadata = session.inputMetadata[0];
  const outputMetadata = session.outputMetadata[0];
  const classCount = outputMetadata?.shape?.at(-1);
  if (inputMetadata?.type !== 'float32'
    || inputMetadata?.shape?.[1] !== 3
    || inputMetadata?.shape?.[2] !== labels.inputSize
    || inputMetadata?.shape?.[3] !== labels.inputSize
    || classCount !== labels.classes.length) {
    await session.release();
    throw new Error('The model tensor shape does not match its class manifest.');
  }

  return { ort, session, labels, modelVersion: config.modelVersion };
}

async function getModel(config) {
  const cacheKey = `${config.modelId}:${config.modelPath}:${config.labelsPath}:${config.externalDataPath}`;
  if (!cachedModels.has(cacheKey)) {
    cachedModels.set(cacheKey, loadModel(config).catch((error) => {
      cachedModels.delete(cacheKey);
      throw error;
    }));
  }
  return cachedModels.get(cacheKey);
}

async function getImageProcessor() {
  if (!cachedImageProcessor) {
    cachedImageProcessor = import('sharp').then((module) => module.default);
  }
  return cachedImageProcessor;
}

async function preprocessImage(buffer, labels) {
  const sharp = await getImageProcessor();
  const resize = labels.preprocess === 'center-crop'
    ? { fit: 'cover', position: 'centre', kernel: 'linear' }
    : { fit: 'fill', kernel: 'linear' };
  const { data, info } = await sharp(buffer, { failOn: 'error' })
    .rotate()
    .toColourspace('srgb')
    .removeAlpha()
    .resize(labels.inputSize, labels.inputSize, resize)
    .raw()
    .toBuffer({ resolveWithObject: true });

  if (info.channels !== 3) throw new Error('The uploaded image could not be converted to RGB.');
  if (labels.mean?.length !== 3 || labels.std?.length !== 3 || labels.std.some((value) => value <= 0)) {
    throw new Error('The model normalization settings are invalid.');
  }

  const planeSize = labels.inputSize * labels.inputSize;
  const input = new Float32Array(planeSize * 3);
  for (let pixel = 0; pixel < planeSize; pixel += 1) {
    for (let channel = 0; channel < 3; channel += 1) {
      input[channel * planeSize + pixel] = (data[pixel * 3 + channel] / 255 - labels.mean[channel]) / labels.std[channel];
    }
  }
  return input;
}

function softmax(logits) {
  const maximum = Math.max(...logits);
  const exponents = logits.map((value) => Math.exp(value - maximum));
  const total = exponents.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0) throw new Error('The model returned invalid scores.');
  return exponents.map((value) => value / total);
}

export async function diagnoseImage({ buffer, crop }) {
  const adapter = cropAdapterRegistry[crop];
  if (!adapter) return { status: 'unsupported_crop' };

  const config = getDiagnosisConfig(crop);
  if (!isDiagnosisConfigured(crop)) return { status: 'unconfigured', minimumConfidence: config.minimumConfidence };

  const model = await getModel(config);
  const imageTensor = new model.ort.Tensor('float32', await preprocessImage(buffer, model.labels), [
    1, 3, model.labels.inputSize, model.labels.inputSize,
  ]);
  const outputs = await model.session.run({ [model.session.inputNames[0]]: imageTensor });
  const scores = Array.from(outputs[model.session.outputNames[0]].data);
  if (scores.length !== model.labels.classes.length || scores.some((value) => !Number.isFinite(value))) {
    throw new Error('The model returned an invalid output tensor.');
  }

  const globalProbabilities = softmax(scores);
  let predictionIndex = 0;
  for (let index = 1; index < globalProbabilities.length; index += 1) {
    if (globalProbabilities[index] > globalProbabilities[predictionIndex]) predictionIndex = index;
  }

  const predictedClass = model.labels.classes[predictionIndex];
  const globalConfidence = globalProbabilities[predictionIndex];

  if (predictedClass.crop === adapter.outputCrop) {
    return {
      status: 'diagnosed',
      crop: predictedClass.crop,
      disease: {
        key: predictedClass.key,
        name: predictedClass.name,
        confidence: globalConfidence,
        healthy: predictedClass.healthy === true || /(^|_)healthy($|_)/i.test(predictedClass.key),
      },
      modelVersion: model.modelVersion,
      minimumConfidence: config.minimumConfidence,
    };
  }

  // Evaluate crop-conditioned probabilities across classes for the selected crop
  const cropIndices = [];
  model.labels.classes.forEach((c, idx) => {
    if (c.crop === adapter.outputCrop) cropIndices.push(idx);
  });

  if (cropIndices.length > 0) {
    const cropLogits = cropIndices.map((i) => scores[i]);
    const cropProbabilities = softmax(cropLogits);
    let bestCropIdx = 0;
    for (let i = 1; i < cropProbabilities.length; i += 1) {
      if (cropProbabilities[i] > cropProbabilities[bestCropIdx]) bestCropIdx = i;
    }
    const bestClass = model.labels.classes[cropIndices[bestCropIdx]];
    const condConfidence = cropProbabilities[bestCropIdx];

    if (condConfidence >= 0.50) {
      return {
        status: 'diagnosed',
        crop: bestClass.crop,
        disease: {
          key: bestClass.key,
          name: bestClass.name,
          confidence: condConfidence,
          healthy: bestClass.healthy === true || /(^|_)healthy($|_)/i.test(bestClass.key),
        },
        modelVersion: model.modelVersion,
        minimumConfidence: config.minimumConfidence,
      };
    }
  }

  return { status: 'crop_mismatch', crop: predictedClass.crop, modelVersion: model.modelVersion };
}

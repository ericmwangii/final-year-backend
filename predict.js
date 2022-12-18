// import * as tf from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs-node";

const model = await tf.loadLayersModel("file://model/Model.json");

const text = ["this is great"];

const prediction = model.predict(text);

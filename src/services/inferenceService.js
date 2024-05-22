const tf = require('@tensorflow/tfjs-node');
const InputError = require('../exceptions/InputError');

async function predictClassification(model, image) {
    const tensor = tf.node
        .decodeJpeg(image)
        .resizeNearestNeighbor([224, 224])
        .expandDims()
        .toFloat()

    const prediction = model.predict(tensor);
    const score = await prediction.data();
    const confidenceScore = Math.max(...score) * 100;

    const classes = ['Cancer', 'Non-cancer'];
    const label = confidenceScore > 50 ? 'Cancer' : 'Non-cancer';

  let suggestion;
  if (label === 'Cancer') {
    suggestion = "Segera periksa ke dokter!";
  } else {
    suggestion = "Anda sehat!";
  }

    return { confidenceScore, label, suggestion };


}

module.exports = predictClassification;

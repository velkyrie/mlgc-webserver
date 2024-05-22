const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');

const predictionHistories = [];

async function postPredictHandler(request, h) {
  const { image } = request.payload;

  if (Buffer.byteLength(image) > 1000000) {
    const response = h.response({
      status: 'fail',
      message: 'Payload content length greater than maximum allowed: 1000000',
    }).code(413);
    return response;
  }

  const { model } = request.server.app;
  const { confidenceScore, label, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  const data = {
    id,
    result: label,
    suggestion,
    createdAt,
  };

  predictionHistories.push(data);

  const response = h.response({
    status: 'success',
    message: confidenceScore > 99 ? 'Model is predicted successfully' : 'Model is predicted successfully',
    data,
  });
  response.code(201);
  return response;
}

async function getHistoriesHandler(request, h) {
  try {
    const data = predictionHistories.map((history) => ({
      id: history.id,
      history: {
        result: history.result,
        createdAt: history.createdAt,
        suggestion: history.suggestion,
        id: history.id,
      },
    }));

    const response = h.response({
      status: 'success',
      data,
    });
    return response;
  } catch (error) {
    console.error('Error retrieving prediction histories:', error);
    const response = h.response({
      status: 'fail',
      message: 'Failed to retrieve prediction histories',
    });
    response.code(400);
    return response;
  }
}

module.exports = {
  getHistoriesHandler,
  postPredictHandler,
};
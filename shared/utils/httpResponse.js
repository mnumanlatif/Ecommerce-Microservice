function success(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ status: 'success', message, data });
}

function error(res, message = 'Error', statusCode = 500, details = null) {
  return res.status(statusCode).json({ status: 'error', message, details });
}

module.exports = {
  success,
  error,
};

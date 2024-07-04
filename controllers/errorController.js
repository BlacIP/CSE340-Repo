const errorController = {};

errorController.generateError = (req, res, next) => {
  // Intentionally throw an error
  throw new Error('This is an intentional error for testing purposes');
};

module.exports = errorController;

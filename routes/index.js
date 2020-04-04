const AppError = require('utils/appError');
const testRouter = require('./test');
const stackRouter = require('./stack');
const companyRouter = require('./company');

const router = (app) => {
  app.use('/test', testRouter);
  app.use('/stack', stackRouter);
  app.use('/company', companyRouter);

  app.all('*', (req, res, next) => {
    const err = {
      msg: `server doesn't have a service for ${req.originalUrl}`,
      status: 'fail',
      statusCode: 404,
    };
    next(err);
  });

  app.use((err, req, res, next) => {
    let error = { ...err };
    error.statusCode = err.statusCode || 500;
    error.status = err.status || 'error';
    error.message = err.message;

    if (error.name === 'CastError') {
      error = new AppError(400, `Invalid ${error.path}: ${error.value}`);
    }

    res.status(error.statusCode).json({
      ok: 0,
      status: error.status,
      msg: error.message,
    });
  });
};

module.exports = router;

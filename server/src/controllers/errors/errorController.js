// Función controladora final para el middleware de error.
const errorController = (err, req, res, next) => {
    console.log(err);

    res.status(err.status || 500).send({
        status: 'error',
        message: err.message,
    });
};

module.exports = errorController;

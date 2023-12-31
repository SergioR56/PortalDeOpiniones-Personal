//Función que se encargará de validar un esquema de datos.
const validateSchema = async (schema, data) => {
    try {
        await schema.validateAsync(data);
    } catch (err) {
        err.status = 400;
        throw err;
    }
};

module.exports = validateSchema;

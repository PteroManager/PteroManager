module.exports.throwError = function throwError(error) {
    if (error.response && error.response.data) return error.response.data;
    else if (error.response && error.response.status) return error.response.status;
    else return error;
}
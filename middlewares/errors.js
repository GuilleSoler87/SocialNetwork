const handleValidationErrors = (error, response) => {
    const errors = Object.values(error.errors).map(element => element.message);
    if (errors.length > 1) {
        const errorMessages = errors.join(" || ");
        response.status(400).send({ messages: errorMessages });
    } else {
        response.status(400).send({ message: errors });
    }
};

const handleTypeError = (error, request, response, next) => {
    console.log(error);
    if (error.name === "ValidationError") {
      handleValidationErrors(error, response);
    } else if (error.keyPattern && error.keyPattern.email) { // agregar verificación para error.keyPattern
      response.status(400).send("The email must be unique");
    } else {
      response.status(500).send("There was a problem");
    }
  };
  

module.exports = { handleTypeError };
const errormiddleware = (err, req, res, next) => {
    try{
        let error = {... err};

        error.message = err.message;

        console.error(err)

        //Mongoose bad objectID
        if(err.name == "CastError"){
            const message = "Resource not found";
            error =new Error(message);
            error.statusCode = 404;
        }

        //Duplicate key 
        if(err.code == 11000){
            const message = "Duplicate field value entered";
            error = new Error(message);
            error.statusCode = 400;
        }

        //validation error
        if(err.name == "ValidationError"){
            const message = Object.values(error.errors).map(val=>val.message);
            error = new Error(message.join(", "));
            error.statusCode = 400;
        }

        res.status(error.statusCode || 500).json({success: false, error: error.message || 'Server error'});
    }catch(error){
        next(error);
    }
};
export default errormiddleware; 
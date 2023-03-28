exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: 'Invalid path entered. Please check your URL and try again.'});
  };

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg});
    } else {
        next(err);
    }
};
 

exports.handlePSQL400s = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: "Bad article_id!"});
    } else {
        next(err);
    }
};


exports.handle404Status = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: 'Requested information not found!'});
    } else {
        next(err);
    }
};


exports.handle500Status = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Ooops! Internal Server Error!' });
};

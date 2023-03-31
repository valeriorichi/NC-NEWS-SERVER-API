exports.handleInvalidPath = (req, res, next) => {
    res.status(404).send({ msg: 'Invalid path entered. Please check your URL and try again.'});
  };

exports.handlePSQLs = (err, req, res, next) => {
    if (err.code === '22P02' && !err.detail) {
        res.statusMessage = "Invalid request: not a valid integer entered!"
        res.status(400).send(res.statusMessage);
    } else if (err.code === '23503') {
        const message = (err.detail.includes('articles')) ? 'article id' : 'username';
        res.status(404).send({ msg: `Bad Request! There is no such ${message}!` });
    } else if (err.code === '23400') {
        res.statusMessage = "Invalid sort_by query parameter! Please check and try again."
        res.status(400).send(res.statusMessage);
    } else {
        next(err);
    }
};

exports.handle204Status = (err, req, res, next) => {
    if (err.status === 204) {
        res.statusMessage = 'No comments found for this article!'
        res.status(204).send(res.statusMessage);
    } else {
        next(err);
    }
};

exports.handle404Status = (err, req, res, next) => {
    if (err.status === 404 ) {
        res.status(404).send({msg: 'Requested information not found!'});
    } else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send(res.statusMessage);
    } else {
        next(err);
    }
};

exports.handle500Status = (err, req, res, next) => {
    console.log(err);
    res.status(500).send(res.statusMessage = 'Ooops! Internal Server Error!');
};

exports.add = function(req, res) {
    req.getConnection(function (err, connection) {
        console.log(req.params);
    });
};

exports.display = function(req, res) {
    res.render('display', {});
}
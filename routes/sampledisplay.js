exports.display = function(req, res) {
    res.render("sampledisplay", {clientName: req.param("clientName"), hashTag: req.param("hashTag")});
};

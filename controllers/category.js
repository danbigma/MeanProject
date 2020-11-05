module.exports.getAll = function(req, res) {
    res.status(200).json({
        masage: "/controllers/category",
        method: "getAll"
    });
};

module.exports.getById = function(req, res) {
    res.status(200).json({
        masage: "/controllers/category",
        method: "getById" 
    });
};

module.exports.remove = function(req, res) {
    
};

module.exports.create = function(req, res) {
    
};

module.exports.update = function(req, res) {
    
};


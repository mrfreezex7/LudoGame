const path = require('path');
const config = require('../config/keys');

exports.isMaintenanceMode = (req, res, next) => {
    if (config.maintenance.current == "true") {
        res.sendFile(path.join(__dirname + '/maintenance.html'));
        return;
    } else {
        next();
    }
}
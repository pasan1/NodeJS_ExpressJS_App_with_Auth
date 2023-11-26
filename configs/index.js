const database = require('./database');

const configure = async (options = {database: true}) => {
    if (options.database === true) {
        await database();
    }
};

module.exports = {
    configure,
};

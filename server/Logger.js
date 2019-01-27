const winston = require('winston');

const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
        verbose: 5,
        silly: 6,
        custom: 7,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'yellow',
    },
};

class Logger {
    constructor() {
        winston.addColors(config.colors);
    }

    init() {
        return winston.createLogger({
            levels: config.levels,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            transports: [
                new winston.transports.Console(),
            ],
            level: 'custom',
        });
    }

}

module.exports = new Logger().init();

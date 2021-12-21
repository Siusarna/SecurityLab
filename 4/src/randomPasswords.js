'use strict';

const { randomInt } = require('crypto');
const config = require('./config');

const generateFullyRandomPassword = () => {
    const passwordLength = randomInt(config.MIN_LENGTH_OF_FULLY_RANDOM_PASSWORD, config.MAX_LENGTH_OF_FULLY_RANDOM_PASSWORD);
    const passwordCharacters = [];
    for (let i = 0; i < passwordLength; i++) {
        const code = randomInt(config.MIN_ASCII_CODE, config.MAX_ASCII_CODE);
        const asciiCharacter = String.fromCharCode(code);
        passwordCharacters.push(asciiCharacter);
    }
    return passwordCharacters.join('');
};

module.exports = {
    generateFullyRandomPassword
}
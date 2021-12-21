'use strict';

const fs = require('fs');
const { randomInt } = require('crypto');
const { MAX_NUMBER_OF_WORDS_IN_HUMAN_LIKE_PASSWORD } = require('./config')

const adjectives = fs.readFileSync(`${__dirname}/static/adjectives.txt`).toString('utf-8').split('\r\n');
const names = fs.readFileSync(`${__dirname}/static/names.txt`).toString().split('\r\n');
const verbs = fs.readFileSync(`${__dirname}/static/verbs.txt`).toString().split('\r\n');

const words = [adjectives, names, verbs];

const generateHumanLikePassword = () => {
    const numberOfWords = randomInt(1, MAX_NUMBER_OF_WORDS_IN_HUMAN_LIKE_PASSWORD);
    const password = [];
    for (let i = 0; i < numberOfWords; i++) {
        const indexOfWordType = randomInt(0, words.length);
        const indexOfWord = randomInt(0, words[indexOfWordType].length);
        let word = words[indexOfWordType][indexOfWord];
        const shouldAddNumber = randomInt(0, 2);
        if (shouldAddNumber) {
            const shouldAddBeforeTheWord = randomInt(0, 2);
            const number = randomInt(0, 2021);
            if (shouldAddBeforeTheWord) {
                word = number + word;
            } else {
                word = word + number
            }
        }
        password.push(word);
    }

    return password.join('');
}

module.exports = {
    generateHumanLikePassword
}
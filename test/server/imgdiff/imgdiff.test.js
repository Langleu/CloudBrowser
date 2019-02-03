import test from 'ava';

const fs = require('fs');
const compareImages = require('resemblejs/compareImages');

let diffTime = null;

const getDiff = async () => {
    const options = {
        output: {
            errorType: "diffOnly",
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: false,
        ignore: "nothing"
    };

    let a = fs.readFileSync(`${__dirname}/a.jpg`);
    let b = fs.readFileSync(`${__dirname}/b.jpg`);

    let startTime = Date.now();
    const data = await compareImages(
        a,
        b,
        options
    );

    let endTime = Date.now();

    diffTime = endTime - startTime;

    await fs.writeFileSync(`${__dirname}/output.jpg`, data.getBuffer());
};

test('Create Diff img', async (t) => {
    await getDiff();
    t.not(diffTime, null);
});
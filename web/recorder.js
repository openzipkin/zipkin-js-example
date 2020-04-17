/* eslint-env browser */
const {
    BatchRecorder
} = require('zipkin');
const {AwsSqsLogger} = require('zipkin-transport-aws-sqs');

let awsSqsLogger = new AwsSqsLogger({
    queueUrl: "http://localhost:4576/queue/sqs-test", //mandatory
    region: 'us-east-1', // optional, region string
    credentialProvider: {
        accessKeyId: 'test',
        secretAccessKey: 'test'
    },
    delaySeconds: 0// optional
});


function recorder(serviceName) {
    return new BatchRecorder({
        logger: awsSqsLogger
    });
}

module.exports.recorder = recorder;

const mqtt = require('mqtt');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const databaseURL = `mongodb://${config.mongo.host}:${config.mongo.port}`; // /${config.mongo.database}
let tasksBeforeExit = [];

const mqttClient = mqtt.connect([{
    host: config.mqtt.host,
    port: config.mqtt.port
}]);

mqttClient.on('connect', (connack) => {
    console.log('Connected to mqtt broker');

    tasksBeforeExit.push(() => {
        return new Promise((resolve) => mqttClient.end(undefined, resolve))
        .then(console.log('Mqtt client stopped'));
    });

    mqttClient.subscribe(config.mqtt.topic, (err, granted) => {            
        if (err) console.error(err);
    })
});

MongoClient.connect(databaseURL, { useNewUrlParser: true })
.then(client => {
    console.log('Connected to database server');

    tasksBeforeExit.push(() => {
        client.close()
        .then(console.log('Mongo client stopped'));
    });

    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.collection);
    collection.createIndex({ 'topic': 1 });

    mqttClient.on('message', (topic, message) => {
        let doc = {
            topic: topic,
            message: message
        }

        collection.insert(doc, (error, result) => {
            if (error) console.error(error);
        });
    });
})
.catch(error => {
    console.error(error);
    process.exit();
});

function exitHandler() {
    Promise.all(tasksBeforeExit.map(task => task()))
    .catch(error => console.error(error));
}

process.on('SIGUSR1', () => process.exit());
process.on('SIGUSR2', () => process.exit());
process.on('SIGINT', () => process.exit());
process.on('exit', exitHandler);
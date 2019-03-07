const mqtt = require('mqtt');
const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

const brokerURL = `mqtt://${config.mqtt.host}:${config.mqtt.port}`;
const databaseURL = `mongodb://${config.mongo.host}:${config.mongo.port}`;
let tasksBeforeExit = [];

const mqttClient = mqtt.connect(brokerURL, {
    clientId: config.mqtt.clientId,
    username: config.mqtt.username,
    password: config.mqtt.password
});

mqttClient.on('error', (error) => console.error(error));
mqttClient.on('close', () => console.log('Disconnecting from mqtt broker'));
mqttClient.on('reconnect', () => console.log('Reconnecting to mqtt broker'));

mqttClient.on('connect', (connack) => {
    console.log(`Connected to mqtt broker on url ${brokerURL}`);
    
    tasksBeforeExit.push(() => {
        return new Promise((resolve) => mqttClient.end(undefined, resolve))
        .then(console.log('Mqtt client stopped'));
    });
    
    mqttClient.subscribe(config.mqtt.topic, (err, granted) => {            
        if (err) console.error(err);
        
        console.log(`Subscribed to ${config.mqtt.topic}`);
    })
});

MongoClient.connect(databaseURL, { useNewUrlParser: true })
.then(client => {
    console.log(`Connected to database server on url ${databaseURL}`);

    tasksBeforeExit.push(() => {
        return client.close()
        .then(console.log('Mongo client stopped'));
    });
    
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.collection);
    collection.createIndex({ 'topic': 1 });

    mqttClient.on('message', (topic, message) => {
        let doc = {
            topic: topic,
            message: {
                deviceId: 'Default device', 
                date: new Date(), 
                ...JSON.parse(message)
            }
        }
        
        collection.insertOne(doc, (error, result) => {
            if (error) console.error(error);
        });
    });
})
.catch(error => {
    console.error(error);
});

function exitHandler() {
    Promise.all(tasksBeforeExit.map(task => task()))
    .catch(error => console.error(error));
}

process.on('SIGUSR1', () => process.exit());
process.on('SIGUSR2', () => process.exit());
process.on('SIGINT', () => process.exit());
process.on('exit', exitHandler);
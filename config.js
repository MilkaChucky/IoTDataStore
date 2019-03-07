module.exports = {
    mqtt: {
        host: process.env.MQTT_BROKER_HOST || 'localhost',
        port: process.env.MQTT_BROKER_PORT || 1883,
        username: process.env.MQTT_BROKER_USER || '',
        password: process.env.MQTT_BROKER_PWD || '',
        clientId: process.env.MQTT_CLIENTID || `client${Math.floor((Math.random() * 100000000) + 1)}`,
        topic: process.env.MQTT_TOPIC || '#'
    },
    mongo: {
        host: process.env.MONGO_HOST || 'localhost',
        port: process.env.MONGO_PORT || 27017,
        database: process.env.MONGO_DB || 'IoT',
        collection: process.env.MONGO_COLLECTION || 'data'
    }
}
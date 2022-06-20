const { Kafka } = require("kafkajs")

const clientId = process.env.KAFKA_SYNC_CLIENT_ID;
const firstBrokers = [process.env.KAFKA_SYNC_FIRST_BROKER];
const secondBrokers = [process.env.KAFKA_SYNC_SECOND_BROKER];
const topic = process.env.KAFKA_SYNC_TOPIC;

const kafka1 = new Kafka({ clientId, brokers: firstBrokers });
const kafka2 = new Kafka({ clientId, brokers: secondBrokers });
const consumer = kafka1.consumer({ groupId: clientId });
const producer = kafka2.producer();

const consume = async () => {
    await consumer.connect();
    await producer.connect();
    await consumer.subscribe({ topic });
    await consumer.run({
        eachMessage: ({ message }) => {
            console.debug("Relayed message: " + message.value)
            producer.send({
                topic: topic,
                messages: [message]
            });
        },
    });
}

consume().catch((err) => {
    console.error("error in consumer: ", err)
});

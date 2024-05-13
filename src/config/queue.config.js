const amqplib = require("amqplib");

let channel, connection;

async function connectQueue() {
    try {
        connection = await amqplib.connect("amqp://localhost");
        channel = await connection.createChannel();

        await channel.assertQueue("noti-queue");
    } catch (error) {
        console.log(error)
    }
}

async function sendData(data) {
    try {
        let check = await channel.sendToQueue("noti-queue", Buffer.from(JSON.stringify(data)))
        console.log("from queueConfig sendData", check)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    connectQueue,
    sendData
}
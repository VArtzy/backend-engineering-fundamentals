const amqp = require(`amqplib`)

const msg = {number: process.argv[2]}

connect()

async function connect() {
    try {
        const amqpServer = `amqps://sduxovzg:l3W_s7dp6sjPavHUXBXuLYWkxiyTOGhd@vulture.rmq.cloudamqp.com/sduxovzg`
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel()
        await channel.assertQueue(`jobs`)
        channel.sendToQueue(`jobs`, Buffer.from(JSON.stringify(msg)))
        console.log(`Job sent successfully ${msg.number}`)
        await channel.close()
        await connection.close()
    } catch (err) {
        console.error(err)
    }
}

const amqp = require(`amqplib`)

connect()

async function connect() {
    try {
        const amqpServer = `amqps://sduxovzg:l3W_s7dp6sjPavHUXBXuLYWkxiyTOGhd@vulture.rmq.cloudamqp.com/sduxovzg`
        const connection = await amqp.connect(amqpServer)
        const channel = await connection.createChannel()
        await channel.assertQueue(`jobs`)

        channel.consume(`jobs`, message => {
            const input = JSON.parse(message.content.toString())
            console.log(`Received job with input ${input.number}`)

            if (input.number == 7) {
                channel.ack(message)
            }
        })

        console.log(`waiting for messages...`)
    } catch (err) {
        console.error(err)
    }
}

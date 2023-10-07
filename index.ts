import express from 'express';
import { getClient } from "r4bbit";
import { server as fibonacciServer } from './server';

const app = express();
const r4bbitUrl = 'amqp://guest:guest@localhost:5672/';



app.get('/', async (req, res) => {

    const client = await getClient(
        [r4bbitUrl],
        {
            createChannelOptions: {
                name: "fibonacci",
                publishTimeout: 9999999
            }
        }
    );


    const reply = await client.publishRPCMessage(
        {
            n: 5,
        },
        {
            exchangeName: 'r4bbit-express',
            routingKey: 'fibonacci.topic',
            replyQueueName: 'fibonacci',
            receiveType: 'json',
        }
    );

    res.json(reply);
});


fibonacciServer().then(() => {
    app.listen(3000, () => {
        console.log('Client started on port 3000');
    });
});


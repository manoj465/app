//@ts-ignore
import { Client, Message } from 'react-native-paho-mqtt';


export default new class {
    private myStorage: any = []
    private id = Math.floor(Math.random() * 10001)
    // Create a client instance
    private client: any = undefined

    constructor() {

        console.log("*******************************************MQTT*************************************************** - " + this.id)

        this.client = new Client({ uri: 'ws://192.168.1.6:8080/mqtt', clientId: 'jhdgkchg', storage: this.Storage })

        // set event handlers
        this.client.on('connectionLost', (responseObject: any) => {
            if (responseObject.errorCode !== 0) {
                console.log(responseObject.errorMessage);
            }
        });
        this.client.on('messageReceived', (message: any) => {
            console.log(message.payloadString);
        });

        // connect the client
        this.client.connect({
            timeout: 30000,
            keepAliveInterval: 20,
            cleanSession: false,
            mqttVersion: 4
        })
            .then(() => {
                // Once a connection has been made, make a subscription and send a message.
                console.log('onConnect- connedted to mqtt server');
                return this.client.subscribe('World', { qos: 1, timeout: 30000 });
            })
            .then(() => {
                console.log("subscribed to mqtt server")
                const message = new Message('Hello');
                message.destinationName = 'World';
                this.client.send(message);
            })
            .catch((responseObject: any) => {
                if (responseObject.errorCode !== 0) {
                    console.log('onConnectionLost:' + responseObject.errorMessage);
                }
            })
    }


    //Set up an in-memory alternative to global localStorage
    private Storage = {
        setItem: (key: number, item: String) => {
            console.log('mqtt ----- set Item');
            this.myStorage[key] = item;
        },
        getItem: (key: number) => {
            console.log('mqtt ----- get Item');
            return this.myStorage[key]
        },
        removeItem: (key: number) => {
            console.log('mqtt ----- remove Item');
            delete this.myStorage[key];
        },
    }

    send = () => {
        console.log('send - id is - ' + this.id);
    }

}

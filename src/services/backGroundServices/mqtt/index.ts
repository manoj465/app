//@ts-ignore
import { Client, Message } from 'react-native-paho-mqtt';
import { uuidv4_8 } from '../../../util/UUID_utils';

export default new (class {
  private myStorage: any = [];
  private id = uuidv4_8();
  // Create a client instance
  private client: any = undefined;

  constructor() {
    console.log('*******MQTT********************** - ' + this.id);
  }

  //Set up an in-memory alternative to global localStorage
  private Storage = {
    setItem: (key: number, item: String) => {
      console.log('mqtt ----- set Item');
      this.myStorage[key] = item;
    },
    getItem: (key: number) => {
      console.log('mqtt ----- get Item');
      return this.myStorage[key];
    },
    removeItem: (key: number) => {
      console.log('mqtt ----- remove Item');
      delete this.myStorage[key];
    },
  };

  private connect = async () => {
    if (this.client)
      await this.client
        .connect({
          timeout: 30000,
          keepAliveInterval: 20,
          cleanSession: false,
          mqttVersion: 4,
        })
        .then(() => {
          // Once a connection has been made, make a subscription and send a message.
          console.log('onConnect- connedted to mqtt server');
          return this.client.subscribe(`users/${this.id}/dn`, { qos: 1, timeout: 30000 });
        })
        .then((txt: any) => {
          console.log('subscribed to mqtt server' + JSON.stringify(txt));
        })
        .catch((responseObject: any) => {
          if (responseObject.errorCode !== 0) {
            console.log('onConnectionError:' + JSON.stringify(responseObject));
          }
        });
  };

  setup = (props: { userId: string }) => {
    console.log('setting up mqtt : ' + this.id);
    this.id = props.userId;
    this.client = new Client({ uri: 'ws://huelite.in:8080/mqtt', clientId: props.userId, storage: this.Storage });

    // set event handlers
    this.client.on('connectionLost', (responseObject: any) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
      }
    });
    this.client.on('messageReceived', (message: any) => {
      console.log('mqttMsg : ' + JSON.stringify(message));
    });

    this.connect();

    // connect the client
  };

  sendToDevice = async (props: { Mac: string; Hostname: string; payload: string }) => {
    console.log('send id - ' + this.id);
    if (this.client && this.client.isConnected()) {
      console.log('---mqtt client present');
      let message = new Message(props.payload);
      message.destinationName = props.Hostname.split('_')[0] + '/' + props.Mac + '/dn';
      this.client.send(message);
    } else if (this.client && !this.client.isConnected()) {
      await this.connect();
      console.log('mqtt client disconnected');
    } else {
      console.log('---no mqtt client');
    }
    return this.id;
  };
})();

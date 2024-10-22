import io from 'socket.io-client';
import { mobile_siteConfig } from "./services/mobile-siteConfig";

class WSService {
    initializeSocket = async (userId) => {
        console.log("initializeSocket", userId);
        try {
            const SOCKET_URL = `${mobile_siteConfig.CHAT_SOCKET_URL}?user_id=${userId}`;
            console.log("initializeSocket_1", SOCKET_URL);

            this.socket = io(SOCKET_URL, {
                transports: ['websocket'],
            });

            this.socket.on('connect', () => {
                console.log("=== socket connected ====");
            });

            this.socket.on('disconnect', () => {
                console.log("=== socket disconnected ====");
            });

            this.socket.on('error', (data) => {
                console.log("socket error", data);
            });

        } catch (error) {
            console.log("socket is not initialized", error);
        }
    };

    // Function to handle incoming messages
    onMessageReceived = (callback) => {
        this.socket.on('message', (data) => {
            console.log('Message received: ', data);
            callback(data);  // Call the provided callback with the message data
        });
    };

    emit(event, data = {}) {
        console.log('Emitting event: ', event, data);
        this.socket.emit(event, data);
    }

    on(event, cb) {
        console.log('Adding listener: ', event, cb);
        this.socket.on(event, cb);
    }

    removeListener(listenerName) {
        console.log('Removing listener: ', listenerName);
        this.socket.removeListener(listenerName);
    }
}

const socketServices = new WSService();

export default socketServices;

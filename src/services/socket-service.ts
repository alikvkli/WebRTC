import { Socket, io } from "socket.io-client";

class SockerService {

    public socket: Socket | null = null;

    public connect(url: string): Promise<Socket> {
        return new Promise((resolve, reject) => {

            this.socket = io(url);

            if (!this.socket) {
                return reject();
            }

            this.socket.on("connect", () => {
                resolve(this.socket as Socket);
            });

            this.socket.on("connect_error", (err) => {
                console.error("connecttion error:", err);
                reject(err);
            });

        })
    }


}


export default new SockerService();
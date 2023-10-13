import { useEffect } from "react"
import socketService from "../services/socket-service"
import JoinRoom from "../components/joinRoom";
import Game from "../components/game";
import { useAppSelector } from "../hooks";


export default function HomePage() {

    const { isInRoom } = useAppSelector(state => state.app)

    const connectSocket = async () => {
        const socket = await socketService
            .connect("http://localhost:9000")
            .catch(err => {
                console.error("Error :", err)
            });
    }

    useEffect(() => {
        connectSocket();
    }, [])

    return (
        <>
            <h1 className="text-center mt-5 text-3xl text-indigo-500 font-semibold">XOX -  Oyununa Hoşgeldiniz!</h1>
            <div className="flex items-center mt-16 justify-center">
                {!isInRoom ? <JoinRoom /> : <Game />}
            </div>
        </>
    )
}
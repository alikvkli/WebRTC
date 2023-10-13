import React, { useEffect, useState } from "react";
import { GrInfo } from "react-icons/gr"
import socketService from "../../services/socket-service";
import { useAppDispatch, useAppSelector } from "../../hooks";
import gameService from "../../services/game-service";
import { setInRoom, setRoomName } from "../../features/app";

interface IJoinRoom {

}

export default function JoinRoom(props: IJoinRoom) {
    const dispatch = useAppDispatch();
    //const [tempRoomName, setTempRoomName] = useState<string>("");
    const { roomName, isInRoom } = useAppSelector(state => state.app)
    const [isJoining, setJoining] = useState(false);

    const handleJoin = async () => {
        const socket = socketService.socket;
        if (!roomName || roomName.trim() === "" || !socket) return;

        setJoining(true);

        const joined = await gameService
            .joinGameRoom(socket, roomName)
            .catch((err) => alert(err));

        if (joined) {
            //dispatch(setRoomName(tempRoomName));
            dispatch(setInRoom(true));
        }
        setJoining(false);

    }





    return (
        <div className="flex flex-col gap-4 px-4">
            <h4 className="flex items-center gap-2 text-md border-2 border-blue-500  py-4 px-2 rounded-md">
                <GrInfo size={16} color="blue" />
                Oyuna başlamak için bir oda oluştur ve bir odaya katıl
            </h4>
            <input
                className="border-2 outline-none text-sm border-zinc-500 rounded-md py-4 px-2"
                type="text"
                value={roomName}
                onChange={(e) => dispatch(setRoomName(e.target.value))}
                placeholder="Oda ismi" />
            <button onClick={handleJoin} disabled={isJoining} className="bg-purple-500 hover:bg-purple-700 text-white rounded-md py-1.5" type="button">
                {isJoining && "İşlem gerçekleştiriliyor..."}
                {!isJoining && "Katıl & Oluştur"}
            </button>
        </div>
    )

}
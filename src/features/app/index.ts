import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { InitialStateProps } from "./types"


const initialState: InitialStateProps = {
    isInRoom: false,
    playerSymbol: "X",
    roomName: "",
    isPlayerTurn: false,
    isGameStarted: false
}

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setInRoom: (state, action: PayloadAction<InitialStateProps['isInRoom']>) => {
            state.isInRoom = action.payload;
        },
        setPlayerSymbol: (state, action: PayloadAction<InitialStateProps['playerSymbol']>) => {
            state.playerSymbol = action.payload;
        },
        setRoomName: (state, action: PayloadAction<InitialStateProps['roomName']>) => {
            state.roomName = action.payload;
        },
        setPlayerTurn: (state, action: PayloadAction<InitialStateProps['isPlayerTurn']>) => {
            state.isPlayerTurn = action.payload;
        },
        setGameStarted: (state, action: PayloadAction<InitialStateProps['isGameStarted']>) => {
            state.isGameStarted = action.payload;
        },
    }
})
    ;

export const {
    setInRoom,
    setPlayerSymbol,
    setRoomName,
    setPlayerTurn,
    setGameStarted
} = appSlice.actions;

export default appSlice.reducer;
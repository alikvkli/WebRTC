export interface InitialStateProps {
    isInRoom: boolean;
    roomName: string;
    playerSymbol: "X" | "O";
    isPlayerTurn: boolean;
    isGameStarted: boolean
}

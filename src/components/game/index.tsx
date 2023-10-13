import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import gameService from "../../services/game-service";
import socketService from "../../services/socket-service";
import { setGameStarted, setPlayerSymbol, setPlayerTurn } from "../../features/app";

interface IGame {

}

export type IPlayMatrix = Array<Array<string | null>>;

export interface IStartGame {
    start: boolean,
    symbol: "X" | "O"
}



export default function Game(props: IGame) {
    const dispatch = useAppDispatch();
    const { playerSymbol, isPlayerTurn, isGameStarted } = useAppSelector(state => state.app);
    const [matrix, setMatrix] = useState<IPlayMatrix>([
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ]);


    const checkGameState = (matrix: IPlayMatrix) => {
        for (let i = 0; i < matrix.length; i++) {
            const row = [];
            for (let j = 0; j < matrix[i].length; j++) {
                row.push(matrix[i][j]);
            }

            if (row.every((value) => value && value === playerSymbol)) {
                return [true, false];
            } else if (row.every((value) => value && value !== playerSymbol)) {
                return [false, true];
            }
        }

        for (let i = 0; i < matrix.length; i++) {
            const column = [];

            for (let j = 0; j < matrix[i].length; j++) {
                column.push(matrix[i][j]);
            }

            if (column.every((value) => value && value === playerSymbol)) {
                alert("Kazandınız.");
                return [true, false];
            } else if (column.every((value) => value && value !== playerSymbol)) {
                alert("Kaybettiniz!");
                return [false, true];
            }
        }

        if (matrix[1][1]) {
            if (matrix[0][0] === matrix[1][1] && matrix[2][2] === matrix[1][1]) {
                if (matrix[1][1] === playerSymbol) return [true, false];
                else return [false, true]
            }

            if (matrix[2][0] === matrix[1][1] && matrix[0][2] === matrix[1][1]) {
                if (matrix[1][1] === playerSymbol) return [true, false];
                else return [false, true]
            }
        }
        //berabere
        if (matrix.every((m) => m.every((v) => v !== null))) {
            return [true, true];
        }

        return [false, false];
    }

    const updateGameMatrix = (column: number, row: number, symbol: "X" | "O") => {
        const newMatrix = [...matrix];
        if (newMatrix[row][column] === null || newMatrix[row][column] === 'null') {
            newMatrix[row][column] = symbol;
            setMatrix(newMatrix)
        }

        if (socketService.socket) {
            gameService.updateGame(socketService.socket, newMatrix);
            const [currentPlayerWon, OtherPlayerWon] = checkGameState(matrix) as any;
            if(currentPlayerWon && OtherPlayerWon){
                gameService.gameWin(socketService.socket, "Oyun berabere!");
                alert("Oyun berabere!")
            }else if(currentPlayerWon && !OtherPlayerWon){
                gameService.gameWin(socketService.socket, "Kazandınız!");
                alert("Kazandınız!")
            }
            dispatch(setPlayerTurn(false))
        }

    }

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (newMatrix) => {
                setMatrix(newMatrix);
                dispatch(setPlayerTurn(true))
                checkGameState(newMatrix)
            })
        }
    }

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onStartGame(socketService.socket, (options) => {
                dispatch(setGameStarted(true))
                dispatch(setPlayerSymbol(options.symbol));
                if (options.start) {
                    dispatch(setPlayerTurn(true))
                } else {
                    dispatch(setPlayerTurn(false))
                }
            })
        }
    }

    const handleGameWin = () => {
        if (socketService.socket) {
            gameService.onGameWin(socketService.socket, (message) => {
                dispatch(setPlayerTurn(false))
                alert(message);
            })
        }
    }

    useEffect(() => {
        handleGameUpdate();
        handleGameStart();
        handleGameWin();
    }, [])



    return (

        <div className="flex flex-col items-center justify-center gap-4">
            {!isGameStarted && <h3 className="my-2 text-zinc-800 text-lg">Oyunun başlaması için kullanıcı bekleniyor...</h3>}

            {(!isGameStarted || !isPlayerTurn) && <div className={classNames("fixed z-20 top-0 left-0 h-full w-full bg-gray-50/20", {
                "cursor-progress": !isGameStarted,
                "cursor-not-allowed": !isPlayerTurn
            })} />}
            <div className="flex justify-center items-center w-full">
                {matrix.map((row, rowIdx) => {
                    return (
                        <div
                            key={rowIdx}
                            className={classNames("relative", {
                                "border-zinc-300": rowIdx === 0
                            })}>
                            {row.map((column, columnIdx) => (
                                <div
                                    onClick={() => updateGameMatrix(columnIdx, rowIdx, playerSymbol)}
                                    key={columnIdx}
                                    className={classNames("relative w-32 rounded-md h-32 flex items-center justify-center hover:bg-black/50 ", {
                                        "border-y-2  border-x-2 border-t-0 border-l-0 border-zinc-300": rowIdx === 0 && columnIdx === 0,
                                        "border-y-2 border-x-2 border-l-0 border-zinc-300": rowIdx === 0 && columnIdx === 1,
                                        "border-y-2  border-l-0 border-b-0 border-x-2  border-zinc-300": rowIdx === 0 && columnIdx === 2,
                                        "border-y-2  border-x-2 border-t-0  border-zinc-300": rowIdx === 1 && columnIdx === 0,
                                        "border-y-2  border-x-2  border-zinc-300": rowIdx === 1 && columnIdx === 1,
                                        "border-y-2  border-x-2  border-b-0 border-zinc-300": rowIdx === 1 && columnIdx === 2,
                                        "border-y-2  border-x-2  border-t-0 border-r-0 border-zinc-300": rowIdx === 2 && columnIdx === 0,
                                        "border-y-2  border-x-2  border-r-0 border-zinc-300": rowIdx === 2 && columnIdx === 1,
                                        "border-y-2  border-x-2  border-r-0 border-b-0 border-zinc-300": rowIdx === 2 && columnIdx === 2,
                                        "bg-red-500 text-4xl text-white": column === "X",
                                        "bg-green-500 text-4xl text-white": column === "O",

                                    })}>{column}
                                </div>
                            ))}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
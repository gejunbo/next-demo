"use client";
import { useCallback, useState } from "react";
import "./page.css";

// 格子组件：修复参数传递错误
function Square({ value, index, onSquareClick }) {
  return (
    <button
      className="square"
      onClick={() => onSquareClick(index)}
      disabled={!!value} // 禁用已落子的格子
    >
      {value}
    </button>
  );
}

// 棋盘组件
function Board({ board, onSquareClick }) {
  return (
    <div className="board">
      {board.map((value, index) => (
        <Square
          key={index}
          value={value}
          index={index}
          onSquareClick={onSquareClick}
        />
      ))}
    </div>
  );
}

// 判赢核心方法（补充完整）
function calWinner(board) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of winCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export default function Game() {
  const INITIAL_BOARD = Array(9).fill(null);
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([
    { text: "Go to game start", type: "reset" },
  ]);
  const [reset, setReset] = useState(false);

  // 修复：落子逻辑（用newBoard计算newWinner，解决“多点一次”问题）
  const onSquareClick = useCallback(
    (index) => {
      // 提前终止：已有胜者/格子已落子
      if (winner || board[index]) return;

      if (reset) {
        setHistory([{ text: "Go to game start", type: "reset" }]);
        setReset(false);
      }

      const value = isX ? "X" : "O";
      const newBoard = [...board];
      newBoard[index] = value;

      // ✅ 关键：用新棋盘立即计算胜者，避免异步状态陷阱
      const newWinner = calWinner(newBoard);

      // 更新状态（立即生效）
      setBoard(newBoard);
      setIsX(!isX);
      setWinner(newWinner); // 直接设置新的胜者

      // 更新历史记录（函数式更新，避免闭包）
      setHistory((prevHistory) => {
        const histValue = `Go to move#${prevHistory.length}`;
        return [...prevHistory, { text: histValue, index, value }];
      });
    },
    [board, isX, winner, reset]
  );

  // 历史记录点击逻辑（优化）
  const onHisItemClick = useCallback(
    (index) => {
      const targetItem = history[index];
      if (targetItem.type === "reset") {
        setBoard(INITIAL_BOARD);
        setWinner(null);
        setIsX(true); // 重置后默认X先下
        setReset(true);
      } else {
        const newBoard = [...INITIAL_BOARD];
        // 遍历到目标步骤，还原棋盘
        for (let i = 1; i <= index; i++) {
          const step = history[i];
          if (step) newBoard[step.index] = step.value;
        }
        // 修复：正确判断回退后的落子方
        const nextIsX = index % 2 === 0;
        setBoard(newBoard);
        setIsX(nextIsX);
        setWinner(history[index + 1] ? null : calWinner(newBoard)); // 回退后清空胜者，重新判断
      }
    },
    [history, INITIAL_BOARD]
  );

  // 游戏状态文本（优化）
  const gameStatus = winner
    ? `Winner: ${winner}`
    : `Next player: ${isX ? "X" : "O"}`;

  return (
    <div className="game">
      <div className="title">{gameStatus}</div>
      <div className="content">
        <Board board={board} onSquareClick={onSquareClick} />
        <div className="history">
          {history.map((item, index) => (
            <button
              key={index} // 修复key重复问题
              className="item"
              onClick={() => onHisItemClick(index)}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

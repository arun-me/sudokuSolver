import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [datas, setDatas] = useState(Array.from({ length: 9 }, () => Array(9).fill("")))
  const [slns, setSlns] = useState(Array.from({ length: 9 }, () => Array(9).fill("")))
  const [isSlnAvailable, setIsSlnAvailable] = useState(false)
  useEffect(() => {
    const item = localStorage.getItem("data")
    if (item) setDatas(JSON.parse(item))
  }, [])
  const [msg, setMsg] = useState("")
  const switchView = () => {
    setIsSlnAvailable(() => !isSlnAvailable)
  }


  const handleData = (e, i, j) => {
    const value = e.target.value
    if ((value >= 1 && value <= 9) || value === "") {
      const temp = [...datas]
      temp[i][j] = value
      setDatas([...temp])
    }
  }

  const handleSln = (e, i, j) => {
    const value = e.target.value
    if ((value >= 1 && value <= 9) || value === "") {
      const temp = [...slns]
      temp[i][j] = value
      setSlns([...temp])
    }
  }
  const clearSudoko = () => {
    localStorage.clear()
    const val = Array.from({ length: 9 }, () => Array(9).fill(""))
    setSlns(val)
    setDatas(val)
    setIsSlnAvailable(false)
  }

  const firstEmptyCell = (temp) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (temp[row][col] === "") return [row, col];
      }
    }
    return null;
  };

  const generateSln = () => {
    localStorage.setItem("data", JSON.stringify(datas))
    const temp = Array.from(datas, row => [...row]);

    const sln = solveSudoku(temp)
    setSlns(sln)
    setIsSlnAvailable(true)

    // let cell = firstEmptyCell(temp);
    // if (!cell) {
    //   setMsg("Solved")
    //   return
    // }
    // let isEmptyCell = !!cell
    // while (isEmptyCell) {
    //   let possibleNos = Array.from({ length: 9 }, (_, i) => i + 1);
    //   function remove(arr, value) {
    //     var index = arr.indexOf(value);
    //     if (index > -1) {
    //       arr.splice(index, 1);
    //     }
    //     possibleNos = arr
    //   }

    //   for (let i = 0; i < 9; i++) {
    //     if (temp[cell[0]][i]) remove(possibleNos, temp[cell[0]][i])
    //     if (cell[1] !== cell[0] && temp[i][cell[1]]) remove(possibleNos, (temp[i][cell[1]]))
    //   }
    //   // if (possibleNos.length === 1) 
    //   temp[cell[0]][cell[1]] = possibleNos[0]
    //   cell = firstEmptyCell(temp);
    //   isEmptyCell = !!cell
    // }  
  }



  function solveSudoku(grid) {
    // Initialize constraints
    const rows = Array.from({ length: 9 }, () => new Set());
    const cols = Array.from({ length: 9 }, () => new Set());
    const boxes = Array.from({ length: 9 }, () => new Set());

    // Populate initial constraints
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const num = grid[i][j];
        if (num !== "") {
          rows[i].add(num);
          cols[j].add(num);
          boxes[getBoxIndex(i, j)].add(num);
        }
      }
    }

    // Helper to get box index
    function getBoxIndex(row, col) {
      return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }

    // Helper to find the next empty cell
    function findEmptyCell() {
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (grid[i][j] === "") return [i, j];
        }
      }
      return null;
    }

    // Backtracking function
    function backtrack() {
      const cell = findEmptyCell();
      if (!cell) return true; // No empty cells, puzzle solved

      const [row, col] = cell;
      const boxIndex = getBoxIndex(row, col);

      for (let num = 1; num <= 9; num++) {
        const charNum = String(num);
        if (!rows[row].has(charNum) && !cols[col].has(charNum) && !boxes[boxIndex].has(charNum)) {
          // Place number
          grid[row][col] = charNum;
          rows[row].add(charNum);
          cols[col].add(charNum);
          boxes[boxIndex].add(charNum);

          // Recursive call
          if (backtrack()) return true;

          // Undo placement (backtrack)
          grid[row][col] = "";
          rows[row].delete(charNum);
          cols[col].delete(charNum);
          boxes[boxIndex].delete(charNum);
        }
      }

      return false; // Trigger backtracking
    }

    backtrack(); // Start solving
    return grid;
  }
  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      {isSlnAvailable ? (
        <div>
          <table>
            <caption>Sudoku Answer</caption>
            <tbody>
              {slns?.map((row, i) => (
                <tr key={i}>
                  {row?.map((value, j) => (
                    <td key={j}>
                      <input
                        type="number"
                        value={slns[i][j]}
                        disabled={!!datas[i][j]}
                        style={datas[i][j] ? { backgroundColor: "#d4edda" } : null}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <table>
          <caption>Sudoku Question</caption>
          <tbody>
            {datas?.map((row, i) => (
              <tr key={i}>
                {row?.map((value, j) => (
                  <td key={j}>
                    <input
                      type="number"
                      value={datas[i][j]}
                      onChange={(e) => handleData(e, i, j)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <button onClick={clearSudoko}>Clear</button>
        <button onClick={switchView}>Switch View</button>
        <button onClick={generateSln}>Solve</button>
      </div>
      <div>{msg}</div>
    </div>
  );
}

export default App;
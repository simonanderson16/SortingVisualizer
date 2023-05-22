import { useState, useEffect } from "react";

export default function ControlPanel() {

    const generateRandomArray = (n) => {
        const randomArray = [];
      
        for (let i = 0; i < n; i++) {
          const randomNumber = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
          randomArray.push(randomNumber);
        }
      
        return randomArray;
      }

    const [array, setArray] = useState(generateRandomArray(50));

    const [arraySize, setArraySize] = useState(50);
    const [sortingSpeed, setSortingSpeed] = useState(50);
    const [selected, setSelected] = useState();

    const handleArraySizeChange = (event) => {
      setArraySize(event.target.value);
    };


    const handleSortingSpeedChange = (event) => {
      setSortingSpeed(event.target.value);
    };

    
    return (
        <>
            <div className="control-panel">
                <div className="section">
                <div className="slider-inputs">
                    <p>Array Size:</p>
                    <input 
                        type="range"
                        className="array-size-slider"
                        min="20"
                        max="100"
                        value={arraySize}
                        onChange={handleArraySizeChange}
                    />
                    <p>Sorting Speed:</p>
                    <input 
                        type="range"
                        className="sorting-speed-slider"
                        min="20"
                        max="100"
                        value={sortingSpeed}
                        onChange={handleSortingSpeedChange}
                    />
                </div>
                </div>
                <div className="section">
                <div className="algorithm-inputs">
                    <button className={selected == "insertion" ? "selected" : "unselected"} onClick={() => setSelected("insertion")}>Insertion Sort</button>
                    <button className={selected == "quick" ? "selected" : "unselected"} onClick={() => setSelected("quick")}>Quick Sort</button>
                    <button className={selected == "bubble" ? "selected" : "unselected"} onClick={() => setSelected("bubble")}>Bubble Sort</button>
                    <button className={selected == "selection" ? "selected" : "unselected"} onClick={() => setSelected("selection")}>Selection Sort</button>
                    <button className={selected == "merge" ? "selected" : "unselected"} onClick={() => setSelected("merge")}>Merge Sort</button>
                </div>
                </div>
                <div className="section">
                <div className="control-inputs">
                    <button className="control-button">Generate New Array</button>
                    <button className="control-button">Run Sorting Algorithm</button>
                </div>
                </div>
            </div>
        </>
    )
}
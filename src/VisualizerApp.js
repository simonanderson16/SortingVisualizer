import { useEffect, useState } from "react";
//import { quickSort, insertionSort, bubbleSort, selectionSort, mergeSort } from "./SortingAlgorithms";
import ArrayPanel from "./ArrayPanel";
import ControlPanel from "./ControlPanel";

export default function VisualizerApp() {

  const STILL = 0;
  const COMPARING = 1;
  const MOVING = 2;
  const COMPLETED = 3;

  class ArrayItem {
    constructor(value, status) {
      this.value = value;
      this.status = status;
    }
  }

    const generateRandomArray = (n) => {
        const randomArray = [];
      
        for (let i = 0; i < n; i++) {
          const randomNumber = Math.floor(Math.random() * (500 - 20 + 1)) + 20;
          randomArray.push(new ArrayItem(randomNumber, STILL));
        }
      
        return randomArray;
      }


    const [arraySize, setArraySize] = useState(100);
    const [sortingSpeed, setSortingSpeed] = useState(50);
    const [selected, setSelected] = useState();
    const [array, setArray] = useState(generateRandomArray(arraySize));

    const handleArraySizeChange = (event) => {
      setArraySize(event.target.value);
    };

    useEffect(() => {
        setArray(generateRandomArray(arraySize));
    }, [arraySize])


    const handleSortingSpeedChange = (event) => {
      setSortingSpeed(event.target.value);
    };

    const generateNewArray = (event) => {
        setArray(generateRandomArray(arraySize));
    }

    const handleRunButton = (event) => {
        if (selected === "insertion") {
            (insertionSort(array));
        } else if (selected === "quick") {
            setArray(quickSort(array));
        } else if (selected === "bubble") {
            setArray(bubbleSort(array));
        } else if (selected === "selection") {
            setArray(selectionSort(array));
        } else if (selected === "merge") {
            setArray(mergeSort(array));
        }
    }

    const lookupColor = (status) => {
        switch (status) {
          case STILL:
            return 'tan';
          case COMPARING:
            return '#7587d6';
          case MOVING:
            return '#da7b93';
          case COMPLETED: 
            return '#73be8c';
          default: 
            return 'tan';
        }
    }

      // SORTING ALGORITHMS
      //==================================================================================================================================

    function insertionSort(arr) {
        for (let i = 1; i < arr.length; i++) {
          const key = arr[i].value;
          let j = i - 1;
      
          while (j >= 0 && arr[j].value > key) {
            arr[j + 1]= arr[j];
            j--;
          }
      
          arr[j + 1] = {value: key, MOVING}; // arr[j + 1] = key
        }
      
        for (let item of arr) {
          item.status = COMPLETED;
        }
        setArray(arr.slice());
      }

      //==================================================================================================================================
    
    function quickSort(arr) {
        if (arr.length <= 1) {
          return arr;
        }
      
        const pivot = arr[arr.length - 1].value;
        const left = [];
        const right = [];
      
        for (let i = 0; i < arr.length - 1; i++) {
          if (arr[i].value < pivot) {
            left.push(arr[i]);
          } else {
            right.push(arr[i]);
          }
        }
      
        return [...quickSort(left), new ArrayItem(pivot, STILL), ...quickSort(right)];
      }
    
      //==================================================================================================================================
    
      function bubbleSort(arr) {
        const n = arr.length;
      
        for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
            if (arr[j].value > arr[j + 1].value) {
              // Swap elements
              const temp = arr[j];
              arr[j] = arr[j + 1];
              arr[j + 1] = temp;
            }
          }
        }
      
        return arr.slice();
      }
    
      //==================================================================================================================================
    
      function selectionSort(arr) {
        const n = arr.length;
      
        for (let i = 0; i < n - 1; i++) {
          let minIndex = i;
      
          for (let j = i + 1; j < n; j++) {
            if (arr[j].value < arr[minIndex].value) {
              minIndex = j;
            }
          }
      
          // Swap elements
          if (minIndex !== i) {
            const temp = arr[i];
            arr[i] = arr[minIndex];
            arr[minIndex] = temp;
          }
        }
      
        return arr.slice();
      }
    
      //==================================================================================================================================
    
      function mergeSort(arr) {
        if (arr.length <= 1) {
          return arr;
        }
      
        const middle = Math.floor(arr.length / 2);
        const leftArr = arr.slice(0, middle);
        const rightArr = arr.slice(middle);
      
        const sortedLeft = mergeSort(leftArr);
        const sortedRight = mergeSort(rightArr);
      
        return merge(sortedLeft, sortedRight);
      }
      
      function merge(leftArr, rightArr) {
        const mergedArr = [];
        let leftIndex = 0;
        let rightIndex = 0;
      
        while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
          if (leftArr[leftIndex].value < rightArr[rightIndex].value) {
            mergedArr.push(leftArr[leftIndex]);
            leftIndex++;
          } else {
            mergedArr.push(rightArr[rightIndex]);
            rightIndex++;
          }
        }
      
        while (leftIndex < leftArr.length) {
          mergedArr.push(leftArr[leftIndex]);
          leftIndex++;
        }
      
        while (rightIndex < rightArr.length) {
          mergedArr.push(rightArr[rightIndex]);
          rightIndex++;
        }
      
        return mergedArr;
      }

      //=================================================================================================================


    return (
        <>
        <div className="app-container">
            <h1 className="title">Sorting Algorithm Visualizer</h1>
            <h4 className="byline">By: Simon Anderson</h4>
            <div className="control-panel">
                <div className="section">
                <div className="slider-inputs">
                    <p>Array Size:</p>
                    <input 
                        type="range"
                        className="array-size-slider"
                        min="50"
                        max="200"
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
                    <button className="control-button" onClick={generateNewArray}>Generate New Array</button>
                    <button className="control-button" onClick={handleRunButton}>Run Sorting Algorithm</button>
                </div>
                </div>
            </div>
            <div className="array-panel" id="array-panel">
                <div className="bars">
                    {array.map((item, index) => (
                        <div key={index} style={{height:`${item.value}px`, backgroundColor:`${lookupColor(item.status)}`}} className="bar"></div>
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}
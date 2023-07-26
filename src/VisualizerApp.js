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
  };

  const [arraySize, setArraySize] = useState(100);
  const [sortingSpeed, setSortingSpeed] = useState(50);
  const [selected, setSelected] = useState("insertion");
  const [array, setArray] = useState(generateRandomArray(arraySize));

  const handleArraySizeChange = (event) => {
    setArraySize(event.target.value);
  };

  useEffect(() => {
    setArray(generateRandomArray(arraySize));
  }, [arraySize]);

  const handleSortingSpeedChange = (event) => {
    setSortingSpeed(event.target.value);
  };

  const generateNewArray = (event) => {
    setArray(generateRandomArray(arraySize));
  };

  const handleRunButton = (event) => {
    if (selected === "insertion") {
      insertionSort(array);
    } else if (selected === "quick") {
      // Create a deep copy of the array to avoid modifying the original array
      const newArray = array.map((item) => ({ ...item }));
      quickSort(newArray, 0, newArray.length - 1);
    } else if (selected === "bubble") {
      bubbleSort(array);
    } else if (selected === "selection") {
      selectionSort(array);
    } else if (selected === "merge") {
      mergeSort(array);
    }
  };

  const lookupColor = (status) => {
    switch (status) {
      case STILL:
        return "tan";
      case COMPARING:
        return "#7587d6";
      case MOVING:
        return "#da7b93";
      case COMPLETED:
        return "#73be8c";
      default:
        return "tan";
    }
  };

  const updateArray = (newArray) => {
    setArray([...newArray]);
  };

  const sleep = () =>
    new Promise((resolve) => setTimeout(resolve, 500 - sortingSpeed));

  // SORTING ALGORITHMS
  //==================================================================================================================================

  const insertionSort = async () => {
    const n = array.length;
    const newArray = [...array];

    for (let i = 1; i < n; i++) {
      let j = i;
      newArray[j].status = COMPARING;
      updateArray(newArray);

      await sleep();

      while (j > 0 && newArray[j - 1].value > newArray[j].value) {
        newArray[j].status = MOVING;
        newArray[j - 1].status = MOVING;
        updateArray(newArray);

        await sleep();

        [newArray[j], newArray[j - 1]] = [newArray[j - 1], newArray[j]];

        newArray[j].status = COMPARING;
        newArray[j - 1].status = COMPARING;
        updateArray(newArray);

        await sleep();

        j--;
      }

      updateArray(newArray);
      await sleep();
    }

    newArray.forEach((item) => (item.status = COMPLETED));
    updateArray(newArray);
  };

  //==================================================================================================================================

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      const partitionIndex = await partition(arr, low, high);
      await quickSort(arr, low, partitionIndex - 1);
      await quickSort(arr, partitionIndex + 1, high);
    } else if (low === high) {
      arr[low].status = COMPLETED;
      updateArray([...arr]);
      await sleep();
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (arr[j].value <= pivot.value) {
        i++;
        arr[i].status = COMPARING;
        arr[j].status = COMPARING;
        updateArray([...arr]);
        await sleep();

        [arr[i], arr[j]] = [arr[j], arr[i]];

        arr[i].status = MOVING;
        arr[j].status = MOVING;
        updateArray([...arr]);
        await sleep();
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    for (let k = low; k <= high; k++) {
      if (k === i + 1) arr[k].status = COMPLETED;
      else arr[k].status = STILL;
    }

    updateArray([...arr]);
    await sleep();

    return i + 1;
  };

  //==================================================================================================================================

  const bubbleSort = async () => {
    const n = array.length;
    const newArray = [...array];

    for (let i = 0; i < n - 1; i++) {
      let swapped = false;

      for (let j = 0; j < n - i - 1; j++) {
        newArray[j].status = COMPARING;
        newArray[j + 1].status = COMPARING;
        updateArray([...newArray]);
        await sleep();

        if (newArray[j].value > newArray[j + 1].value) {
          newArray[j].status = MOVING;
          newArray[j + 1].status = MOVING;
          updateArray([...newArray]);
          await sleep();

          [newArray[j], newArray[j + 1]] = [newArray[j + 1], newArray[j]];
          swapped = true;

          newArray[j].status = STILL;
          newArray[j + 1].status = STILL;
          updateArray([...newArray]);
          await sleep();
        }

        newArray[j].status = STILL;
        newArray[j + 1].status = STILL;
        updateArray([...newArray]);
        await sleep();
      }

      if (!swapped) break;

      for (let k = n - i - 1; k < n; k++) {
        newArray[k].status = COMPLETED;
      }

      updateArray([...newArray]);
      await sleep();
    }

    newArray.forEach((item) => (item.status = COMPLETED));
    updateArray([...newArray]);
    await sleep();
  };
  //==================================================================================================================================

  const selectionSort = async () => {
    const n = array.length;
    const newArray = [...array];

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;

      for (let j = i + 1; j < n; j++) {
        newArray[j].status = COMPARING;
        updateArray([...newArray]);
        await sleep();

        if (newArray[j].value < newArray[minIndex].value) {
          if (minIndex !== i) {
            newArray[minIndex].status = STILL;
          }
          minIndex = j;
          newArray[j].status = MOVING; // set the basis for comparison as a different color to make it stand out
          updateArray([...newArray]);
          await sleep();
        } else {
          newArray[j].status = STILL;
          updateArray([...newArray]);
          await sleep();
        }
      }

      if (minIndex !== i) {
        newArray[i].status = MOVING;
        newArray[minIndex].status = MOVING;
        updateArray([...newArray]);
        await sleep();

        // Swap the elements
        [newArray[i], newArray[minIndex]] = [newArray[minIndex], newArray[i]];

        newArray[i].status = STILL;
        newArray[minIndex].status = STILL;
        updateArray([...newArray]);
        await sleep();
      }

      newArray[i].status = COMPLETED;
      updateArray([...newArray]);
      await sleep();
    }

    // Mark the last element as completed, as it is now in its correct position
    newArray[n - 1].status = COMPLETED;
    updateArray([...newArray]);
    await sleep();
  };

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

    setArray(mergedArr);
    return mergedArr;
  }

  //=================================================================================================================

  return (
    <>
      <div className="app-container">
        {/*<h1 className="title">Sorting Algorithm Visualizer</h1>
            <h4 className="byline">By: Simon Anderson</h4>*/}
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
                min="0"
                max="495"
                value={sortingSpeed}
                onChange={handleSortingSpeedChange}
              />
            </div>
          </div>
          <div className="section">
            <div className="algorithm-inputs">
              <button
                className={selected === "insertion" ? "selected" : "unselected"}
                onClick={() => setSelected("insertion")}
              >
                Insertion Sort
              </button>
              <button
                className={selected === "quick" ? "selected" : "unselected"}
                onClick={() => setSelected("quick")}
              >
                Quick Sort
              </button>
              <button
                className={selected === "bubble" ? "selected" : "unselected"}
                onClick={() => setSelected("bubble")}
              >
                Bubble Sort
              </button>
              <button
                className={selected === "selection" ? "selected" : "unselected"}
                onClick={() => setSelected("selection")}
              >
                Selection Sort
              </button>
              <button
                className={selected === "merge" ? "selected" : "unselected"}
                onClick={() => setSelected("merge")}
              >
                Merge Sort
              </button>
            </div>
          </div>
          {/*<div className="section">
                <div className="control-inputs">
                    <button className="control-button" onClick={generateNewArray}>Generate New Array</button>
                    <button className="run-button" onClick={handleRunButton}>Run</button>
                </div>
          </div>*/}
        </div>
        <div className="control-inputs">
          <button className="control-button" onClick={generateNewArray}>
            Generate New Array
          </button>
          <button className="run-button" onClick={handleRunButton}>
            Run
          </button>
        </div>
        <div className="array-panel" id="array-panel">
          <div className="bars">
            {array.map((item, index) => (
              <div
                key={index}
                style={{
                  height: `${item.value}px`,
                  backgroundColor: `${lookupColor(item.status)}`,
                }}
                className="bar"
              ></div>
            ))}
          </div>
        </div>
        <h4 className="byline">
          Sorting Algorithm Visualizer Made by{" "}
          <a href="https://github.com/simonanderson16" target="_blank">
            Simon Anderson
          </a>
        </h4>
      </div>
    </>
  );
}

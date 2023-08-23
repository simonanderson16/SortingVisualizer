import { useEffect, useState } from "react";
//import { quickSort, insertionSort, bubbleSort, selectionSort, mergeSort } from "./SortingAlgorithms";
import ArrayPanel from "./ArrayPanel";
import ControlPanel from "./ControlPanel";

export default function VisualizerApp() {
  const STILL = 0;
  const COMPARING = 1;
  const MOVING = 2;
  const COMPLETED = 3;
  const PARTITION = 4;

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
  const [sortingSpeed, setSortingSpeed] = useState(495);
  const [selected, setSelected] = useState("insertion");
  const [array, setArray] = useState(generateRandomArray(arraySize));
  const [running, setRunning] = useState(false);

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
    if (running) return;
    setArray(generateRandomArray(arraySize));
  };

  const handleRunButton = (event) => {
    if (running) return;
    setRunning(true);
    if (selected === "insertion") {
      insertionSort(array);
    } else if (selected === "quick") {
      const newArray = array.map((item) => ({ ...item }));
      performQuickSort();
    } else if (selected === "bubble") {
      bubbleSort(array);
    } else if (selected === "selection") {
      selectionSort(array);
    } else if (selected === "merge") {
      performMergeSort();
    }
  };

  const handleResetButton = (event) => {
    setRunning(false);
    setArray(generateRandomArray(arraySize));
  };

  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    const updateBarWidth = () => {
      const arrayPanel = document.getElementById("array-panel");
      const arrayPanelWidth = arrayPanel.offsetWidth;
      const numberOfBars = array.length;
      const totalMargins =
        (numberOfBars - 1) * (window.innerWidth < 768 ? 1 : 2);

      const calculatedBarWidth =
        (arrayPanelWidth * 0.95 - totalMargins) / numberOfBars;

      setBarWidth(calculatedBarWidth);
    };

    updateBarWidth();
    window.addEventListener("resize", updateBarWidth);

    return () => window.removeEventListener("resize", updateBarWidth);
  }, [array]);

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
      case PARTITION:
        return "#1cdced";
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

        newArray[j].status = STILL;
        newArray[j - 1].status = STILL;
        updateArray(newArray);

        await sleep();

        j--;
      }

      newArray.forEach((item, index) => {
        if (index <= i) {
          item.status = COMPLETED;
        } else {
          item.status = STILL;
        }
      });

      updateArray(newArray);
      await sleep();
    }
  };

  //==================================================================================================================================

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      const partitionIndex = await partition(arr, low, high);
      await quickSort(arr, low, partitionIndex - 1);
      await quickSort(arr, partitionIndex + 1, high);

      // Mark the sorted section as completed
      for (let i = low; i <= high; i++) {
        arr[i].status = COMPLETED;
      }
      updateArray([...arr]);
      await sleep();
    } else if (low === high) {
      arr[low].status = COMPLETED;
      updateArray([...arr]);
      await sleep();
    }
  };

  const partition = async (arr, low, high) => {
    const pivot = arr[high];
    let i = low - 1;

    arr[high].status = PARTITION;

    for (let j = low; j < high; j++) {
      arr[j].status = COMPARING;
    }

    updateArray([...arr]);
    await sleep();

    for (let j = low; j < high; j++) {
      if (arr[j].value <= pivot.value) {
        i++;

        arr[i].status = MOVING;
        arr[j].status = MOVING;

        updateArray([...arr]);
        await sleep();

        [arr[i], arr[j]] = [arr[j], arr[i]];

        arr[i].status = STILL;
        arr[j].status = STILL;

        updateArray([...arr]);
        await sleep();
      } else {
        arr[j].status = STILL;
        updateArray([...arr]);
        await sleep();
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    for (let k = low; k <= high; k++) {
      if (k !== i + 1) {
        arr[k].status = STILL;
      }
    }

    // Mark the partitioned element as completed
    arr[i + 1].status = COMPLETED;

    updateArray([...arr]);
    await sleep();

    arr[high].status = STILL;

    return i + 1;
  };

  const performQuickSort = async () => {
    const newArray = [...array];
    await quickSort(newArray, 0, newArray.length - 1);

    const completedArray = newArray.map((item) => ({
      ...item,
      status: COMPLETED,
    }));
    updateArray(completedArray);
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

    newArray[n - 1].status = COMPLETED;
    updateArray([...newArray]);
    await sleep();
  };

  //==================================================================================================================================

  const mergeSort = async (start, end) => {
    if (start >= end) {
      return;
    }

    const middle = Math.floor((start + end) / 2);

    await mergeSort(start, middle);
    await mergeSort(middle + 1, end);

    await merge(start, middle, end);
  };

  const merge = async (start, middle, end) => {
    const mergedArray = [];
    let leftIndex = start;
    let rightIndex = middle + 1;

    while (leftIndex <= middle && rightIndex <= end) {
      if (array[leftIndex].value < array[rightIndex].value) {
        mergedArray.push(array[leftIndex]);
        leftIndex++;
      } else {
        mergedArray.push(array[rightIndex]);
        rightIndex++;
      }
    }

    while (leftIndex <= middle) {
      mergedArray.push(array[leftIndex]);
      leftIndex++;
    }

    while (rightIndex <= end) {
      mergedArray.push(array[rightIndex]);
      rightIndex++;
    }

    for (let i = 0; i < mergedArray.length; i++) {
      array[start + i] = mergedArray[i];
      array[start + i].status = MOVING;
      setArray([...array]);
      await sleep();
    }

    for (let i = start; i <= end; i++) {
      array[i].status = STILL;
    }
    setArray([...array]);
  };

  const performMergeSort = async () => {
    await mergeSort(0, array.length - 1);

    const completedArray = array.map((item) => ({
      ...item,
      status: COMPLETED,
    }));
    setArray(completedArray);
  };

  //=================================================================================================================

  return (
    <>
      <div className="app-container">
        <div className="control-panel">
          <div className="section">
            <div className="slider-inputs">
              <div style={{ display: "flex" }}>
                <p>Array Size:</p>
                <input
                  type="range"
                  className="array-size-slider"
                  min="50"
                  max={window.innerWidth < 768 ? "100" : "200"}
                  value={arraySize}
                  onChange={handleArraySizeChange}
                />
              </div>
              <div style={{ display: "flex" }}>
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
          </div>
          <div className="section">
            <div className="algorithm-inputs">
              <button
                className={selected === "insertion" ? "selected" : "unselected"}
                onClick={() => (running ? null : setSelected("insertion"))}
              >
                Insertion Sort
              </button>
              <button
                className={selected === "quick" ? "selected" : "unselected"}
                onClick={() => (running ? null : setSelected("quick"))}
              >
                Quick Sort
              </button>
              <button
                className={selected === "bubble" ? "selected" : "unselected"}
                onClick={() => (running ? null : setSelected("bubble"))}
              >
                Bubble Sort
              </button>
              <button
                className={selected === "selection" ? "selected" : "unselected"}
                onClick={() => (running ? null : setSelected("selection"))}
              >
                Selection Sort
              </button>
              <button
                className={selected === "merge" ? "selected" : "unselected"}
                onClick={() => (running ? null : setSelected("merge"))}
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
            {/* {running ? "Reset" : "Run"} */}
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
                  width: `${barWidth}px`,
                  marginLeft: `${window.innerWidth < 768 ? "0.5px" : "1px"}`,
                  marginRight: `${window.innerWidth < 768 ? "0.5px" : "1px"}`,
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

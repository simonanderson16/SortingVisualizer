import ArrayPanel from "./ArrayPanel";
import ControlPanel from "./ControlPanel";

export default function VisualizerApp() {
    return (
        <>
            <h1 className="title">Sorting Algorithm Visualizer</h1>
            <h4 className="byline">By: Simon Anderson</h4>
            <ControlPanel/>
            <ArrayPanel/>
        </>
    )
}
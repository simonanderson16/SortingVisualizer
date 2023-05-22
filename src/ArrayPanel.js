export default function ArrayPanel({ array }) {

    return (
        <>
            <div className="array-panel" id="array-panel">
                <div className="bars">
                    {array.map((item, index) => (
                        <div key={index} style={{height:`${item}px`}} className="bar"></div>
                    ))}
                </div>
            </div>
        </>
    )
}
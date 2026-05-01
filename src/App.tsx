import Tesseract from "./components/Tesseract.tsx";

function App(){
    return(
        <div>
            <h1 style={{ textAlign: "center" }}>
                Tesseract
            </h1>
            <div className={"tesseract-container"}>
                <Tesseract />
            </div>
        </div>
    )
}

export default App;
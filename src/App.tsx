import Tesseract from "./components/Tesseract.tsx";
import Navbar from "./components/Navbar.tsx";

function App(){
    return(
        <div>
            <div>
                <Navbar/>
            </div>
            <div className={"tesseract-container"}>
                <Tesseract />
            </div>
        </div>
    )
}

export default App;
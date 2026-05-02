import Tesseract from "./components/Tesseract.tsx";
import Navbar from "./components/Navbar.tsx";
import Description from "./components/Description.tsx";

function App(){
    return(
        <div>
            <div>
                <Navbar/>
            </div>
            <div className={"tesseract-container"}>
                <Tesseract />
            </div>
            <div>
                <Description/>
            </div>
        </div>
    )
}

export default App;
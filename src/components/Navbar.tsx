import {useState} from "react";

function Navbar(){
    const titles = ["Homepage", "What I'm proud of", "Contact"]
    const [active, setActive] = useState<string>(titles[0])

    return (
        <nav className="navbar">
            {titles.map((title) => (
                <button className={`nav-button ${active === title ? 'active' : ''}`}
                        onClick={() => setActive(title)}
                >{title}</button>
            ))}
        </nav>
    )
}

export default Navbar;
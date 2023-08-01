export default function Star({index, checked = false, interactable = false, onStarEnter, onStarLeave, onStarClick}) {
    if (interactable) {
        return checked ? <span onMouseEnter={() => onStarEnter(index)} onMouseLeave={onStarLeave} onClick={() => onStarClick(index)} className="star user_rating starselected">&#9733;</span> : 
                         <span onMouseEnter={() => onStarEnter(index)} onMouseLeave={onStarLeave} onClick={() => onStarClick(index)} className="star user_rating">&#9734;</span>;
    }
    else {
        return checked ? <span className="star user_rating starselected">&#9733;</span> : 
                         <span className="star user_rating">&#9734;</span>;
    }
}
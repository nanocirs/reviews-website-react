type StarProps = {
    index: number;
    checked? : boolean;
    interactable? : boolean;
    onStarEnter? : (index : number) => void;
    onStarLeave? : () => void;
    onStarClick? : (index : number) => void;
}

export default function Star({index, checked = false, interactable = false, onStarEnter, onStarLeave, onStarClick} : StarProps) {
    if (interactable) {
        return checked ? <span onMouseEnter={() => onStarEnter(index)} onMouseLeave={onStarLeave} onClick={() => onStarClick(index)} className="star user_rating starselected">&#9733;</span> : 
                         <span onMouseEnter={() => onStarEnter(index)} onMouseLeave={onStarLeave} onClick={() => onStarClick(index)} className="star user_rating">&#9734;</span>;
    }
    else {
        return checked ? <span className="star user_rating starselected">&#9733;</span> : 
                         <span className="star user_rating">&#9734;</span>;
    }
}
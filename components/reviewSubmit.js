"use client"
import { useRouter } from 'next/navigation';
import { useState, useCallback } from "react";
import Star from "./star";

export default function ReviewSubmit() {
    const router = useRouter();

    const [stars, setStars] = useState(null);
    const [confirmedStars, setConfirmedStars] = useState(null);
    const [userInput, setUserInputValue] = useState('');
    const [reviewInput, setReviewInputValue] = useState('');
    const [inputWarnings, setInputWarnings] = useState([]);

    const handleStarLeave = useCallback(() => confirmedStars ? null : setStars(1));
    const handleStarEnter = useCallback((index) => confirmedStars ? null : setStars(index + 1));
    const handleStarClick = useCallback((index) => setConfirmedStars(index + 1));
    const handleUserInputChange = (e) => setUserInputValue(e.target.value);
    const handleReviewInputChange = (e) => setReviewInputValue(e.target.value);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = {
            user: userInput,
            review: reviewInput,
            rating: confirmedStars,
        };

        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            if (!response.ok) {
                console.error('There has been an error while submitting the form');
            }
            else {
                const data = await response.json(); 
                setInputWarnings(data.warning);

                if (data.published) {
                    setReviewInputValue('');
                    setUserInputValue('');
                    setStars(null);
                    setConfirmedStars(null);
                    router.refresh();
                }
            }
        } 
        catch {
            console.error('There has been an error while submitting the form.');
        }
    };
    
    const generateStars = (() => {
        return Array(5).fill(null).map((_, index) => {
            let rating = confirmedStars ? confirmedStars : stars;
            if (index < rating) {
                return (
                    <Star 
                        key={index} 
                        checked={true} 
                        interactable={true} 
                        index={index}
                        onStarEnter={handleStarEnter} 
                        onStarLeave={handleStarLeave}
                        onStarClick={handleStarClick}
                    />
                );
            }
            else {
                return (
                    <Star 
                        key={index} 
                        checked={false} 
                        interactable={true} 
                        index={index}
                        onStarEnter={handleStarEnter} 
                        onStarLeave={handleStarLeave}
                        onStarClick={handleStarClick}
                    />
                );
            }
        });
    })();

    const generateWarnings = (() => {
        if (inputWarnings.length === 0) {
            return null;
        }
        
        return (
            <div className="error">
                {inputWarnings.map((warning) => { return <p key={warning[0]}>{warning[1]}</p>; })}
            </div>
        );
    })()
    
    return (
        <>
            <form onSubmit={handleSubmit} className="review">
                <div className="rating">
                    <p>Your Rating </p>{generateStars}
                </div>
                <div>
                    <p>Share your thoughts:</p>
                    <textarea 
                        className="review_area" 
                        maxLength={500}
                        name="review" 
                        autoComplete="off"
                        autoFocus 
                        value={reviewInput}
                        onChange={handleReviewInputChange}
                    />
                </div>
                <div>
                <p>Provide a username</p>
                <input 
                    className="input_name" 
                    type="text"
                    minLength={3} 
                    maxLength={32} 
                    name="user"
                    autoComplete="off" 
                    value={userInput}
                    onChange={handleUserInputChange}
                    />
                <button type="submit" className="btn">Submit</button>
                </div>
                <div className="error">
                    {generateWarnings}
                </div>
            </form>       
        </>
    );
}
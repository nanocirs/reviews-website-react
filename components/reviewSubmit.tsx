"use client"
import { useRouter } from 'next/navigation';
import { useState, useCallback } from "react";
import Star from "./star";
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

interface FormData {
    user: string;
    review: string;
    rating: number;
}

interface ResponseJSON {
    warning: [number, string][];
    published: boolean;
}

export default function ReviewSubmit() {
    const router : AppRouterInstance = useRouter();

    const [stars, setStars] = useState<number | null>(null);
    const [confirmedStars, setConfirmedStars] = useState<number | null>(null);
    const [userInput, setUserInputValue] = useState<string>('');
    const [reviewInput, setReviewInputValue] = useState<string>('');
    const [inputWarnings, setInputWarnings] = useState<[number, string][]>([]);

    const handleStarLeave = useCallback(() => confirmedStars ? null : setStars(1), [confirmedStars]);
    const handleStarEnter = useCallback((index : number) => confirmedStars ? null : setStars(index + 1), [confirmedStars]);
    const handleStarClick = useCallback((index : number) => setConfirmedStars(index + 1), []);
    const handleUserInputChange = (e : React.ChangeEvent<HTMLInputElement>) => setUserInputValue(e.target.value);
    const handleReviewInputChange = (e : React.ChangeEvent<HTMLTextAreaElement>) => setReviewInputValue(e.target.value);
    
    const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const formData : FormData = {
            user: userInput,
            review: reviewInput,
            rating: confirmedStars,
        };

        try {
            const response : Response = await fetch('/api/submit', {
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
                const data : ResponseJSON = await response.json(); 
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

    function Stars() : JSX.Element[] {
        return Array(5).fill(null).map((_, index) => {
            let rating : number = confirmedStars ? confirmedStars : stars;
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
    };

    function Warning() : JSX.Element {
        if (inputWarnings.length === 0) {
            return null;
        }
    
        return (
            <div className="error">
                {inputWarnings.map((warning) => { return <p key={warning[0]}>{warning[1]}</p>; })}
            </div>
        );
    }
    
    return (
        <>
            <form onSubmit={handleSubmit} className="review">
                <div className="rating">
                    <p>Your Rating </p><Stars />
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
                    <Warning />
                </div>
            </form>       
        </>
    );
}
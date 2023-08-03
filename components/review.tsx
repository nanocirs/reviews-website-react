import Star from "./star";

type Review = {
    user: string;
    text: string;
    rating: number;
    date: Date;
}

export default function Review({user, text, rating, date} : Review) {
    const dateObj : Date = new Date(date);
    const reviewDate : string = dateObj.toLocaleDateString('en-US');
    const reviewTime : string= dateObj.toLocaleTimeString('es-ES');

    function Stars() : JSX.Element[] {
        if (isNaN(rating)) { return null; }
        rating = Math.min(5, Math.max(1, rating));

        const filledStars : JSX.Element[] = Array(rating).fill(null).map((_, index) => { return <Star key={index} index={index} checked={true} /> });
        const emptyStars : JSX.Element[] = Array(5 - rating).fill(null).map((_, index) => { return <Star key={index + rating} index={index} checked={false} /> });

        return [...filledStars, ...emptyStars];
    }

    return (
        <>
            <div className="review published">
                <p className="review_title"><a className="review_username">{user}</a><Stars /></p>
                <p>{text}</p>
                <p className="info">Posted on {reviewDate} at {reviewTime}</p>
            </div>
        </>
    );
}
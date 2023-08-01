import Star from "./star";

export default function Review({user, text, rating, date}) {
    const dateObj = new Date(date);
    const reviewDate = dateObj.toLocaleDateString('en-US');
    const reviewTime = dateObj.toLocaleTimeString('es-ES');

    const stars = (() => {
        rating = parseInt(rating);
        if (isNaN(rating)) { return null; }
        rating = Math.min(5, Math.max(1, rating));

        const filledStars = Array(rating).fill(null).map((_, index) => { return <Star key={index} checked={true} /> });
        const emptyStars = Array(5 - rating).fill(null).map((_, index) => { return <Star key={index + rating} checked={false} /> });
        return [...filledStars, ...emptyStars];
    })();

    return (
        <>
            <div className="review published">
                <p className="review_title"><a className="review_username">{user}</a>{stars}</p>
                <p>{text}</p>
                <p className="info">Posted on {reviewDate} at {reviewTime}</p>
            </div>
        </>
    );
}
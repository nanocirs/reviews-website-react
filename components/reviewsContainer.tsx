"use client"
import { useState } from "react";
import Review from "./review";
import ReactPaginate from "react-paginate";
import { RowDataPacket } from "mysql2";

interface ReviewRow extends RowDataPacket {
    id: number,
    user: string,
    review: string,
    date: Date,
    rating: number
}

export default function ReviewsContainer({reviews} : { reviews: ReviewRow[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage : number = 10;

    let reviewList : JSX.Element[] | null = null;

    if (Array.isArray(reviews) && reviews.length > 0) {
        reviewList = reviews.map((review) => 
            <Review 
                key={review.id}
                user={review.user}
                text={review.review}
                rating={review.rating}
                date={review.date}
            />
        );
    }

    let currentReviews : JSX.Element[] | null = null;

    if (reviewList) {
        const lastReviewIndex : number = currentPage * reviewsPerPage;
        const indexOfFirstPost : number = lastReviewIndex - reviewsPerPage;
        currentReviews = reviewList.slice(indexOfFirstPost, lastReviewIndex);
    }
    
    function handlePageChange({selected} : {selected : number}) : void {
        setCurrentPage(selected + 1);
    }

    return (
    <>
        {currentReviews}
        {reviewList && reviewList.length > reviewsPerPage ? 
            <ReactPaginate
                onPageChange={handlePageChange}
                pageCount={Math.ceil(reviews.length / reviewsPerPage)}
                previousLabel={'Prev'}
                nextLabel={'Next'}
                containerClassName={'pagebar'}
                pageLinkClassName={'page-number'}
                previousLinkClassName={'page-number'}
                nextLinkClassName={'page-number'}
                activeLinkClassName={'active'}
                marginPagesDisplayed={3}
                pageRangeDisplayed={1}
            />
            : null
        }
    </>
    );
}
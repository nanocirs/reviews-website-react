"use client"
import { useState } from "react";
import Review from "./review";
import ReactPaginate from "react-paginate";

export default function ReviewsContainer({reviews}) {
    const [currentPage, setCurrentPage] = useState(1);
    const reviewsPerPage = 10;

    let reviewList = null;

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

    let currentReviews = null;

    if (reviewList) {
        const lastReviewIndex = currentPage * reviewsPerPage;
        const indexOfFirstPost = lastReviewIndex - reviewsPerPage;
        currentReviews = reviewList.slice(indexOfFirstPost, lastReviewIndex);
    }

    const handlePageChange = (e) => {
        setCurrentPage(e.selected + 1)
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
            : 
            null
        }
    </>
    );
}
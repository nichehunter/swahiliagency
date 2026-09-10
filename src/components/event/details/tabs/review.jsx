"use client";
import { ReviewsSkeleton } from "@/components/common/sekeleton/ReviewsSkeleton";
import { StarFilled } from "@ant-design/icons";
import { Pagination } from "antd";
import { useState } from "react";

const reviewsData = [
  {
    id: 1,
    name: "Amina Hassan",
    rating: 5,
    comment:
      "Amazing experience. The atmosphere was excellent and everything was well organized. I really enjoyed the evening.",
    date: "2 days ago",
    initials: "AH",
  },
  {
    id: 2,
    name: "Mohamed Ali",
    rating: 5,
    comment:
      "A wonderful event with great entertainment. The location was beautiful and the overall experience was memorable.",
    date: "5 days ago",
    initials: "MA",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    rating: 4,
    comment:
      "Really enjoyed the event. The music and entertainment were great. The program could have started a little earlier.",
    date: "1 week ago",
    initials: "SJ",
  },
  {
    id: 4,
    name: "Abdallah Omar",
    rating: 5,
    comment:
      "Excellent experience from start to finish. Friendly staff, great atmosphere and a very enjoyable evening.",
    date: "2 weeks ago",
    initials: "AO",
  },
  {
    id: 5,
    name: "Fatma Said",
    rating: 4,
    comment:
      "It was a very nice experience and I would definitely recommend it to visitors looking for entertainment.",
    date: "3 weeks ago",
    initials: "FS",
  },
  {
    id: 6,
    name: "Amina Hassan",
    rating: 5,
    comment:
      "Amazing experience. The atmosphere was excellent and everything was well organized. I really enjoyed the evening.",
    date: "2 days ago",
    initials: "AH",
  },
  {
    id: 7,
    name: "Mohamed Ali",
    rating: 5,
    comment:
      "A wonderful event with great entertainment. The location was beautiful and the overall experience was memorable.",
    date: "5 days ago",
    initials: "MA",
  },
  {
    id: 8,
    name: "Sarah Johnson",
    rating: 4,
    comment:
      "Really enjoyed the event. The music and entertainment were great. The program could have started a little earlier.",
    date: "1 week ago",
    initials: "SJ",
  },
  {
    id: 9,
    name: "Abdallah Omar",
    rating: 5,
    comment:
      "Excellent experience from start to finish. Friendly staff, great atmosphere and a very enjoyable evening.",
    date: "2 weeks ago",
    initials: "AO",
  },
  {
    id: 10,
    name: "Fatma Said",
    rating: 4,
    comment:
      "It was a very nice experience and I would definitely recommend it to visitors looking for entertainment.",
    date: "3 weeks ago",
    initials: "FS",
  },
];
export const ReviewTab = () => {
  const [loading, setLoading] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  const reviewsPerPage = 5;

  const reviewStartIndex = (reviewPage - 1) * reviewsPerPage;

  const paginatedReviews = reviewsData.slice(
    reviewStartIndex,
    reviewStartIndex + reviewsPerPage,
  );

  return (
    <>
      {loading ? (
        <ReviewsSkeleton />
      ) : (
        <div className="sw-details-content">
          <section className="sw-details-card">
            <div className="sw-details-card-header">
              <div>
                <h2>Reviews</h2>
                <p>Visitor feedback and ratings</p>
              </div>

              <div className="sw-details-review-summary">
                <StarFilled />
                <strong>4.8</strong>
                <span>{reviewsData.length} reviews</span>
              </div>
            </div>

            <div className="sw-details-review-list">
              {paginatedReviews.map((review) => (
                <div key={review.id} className="sw-details-review-item">
                  <div className="sw-details-review-avatar">
                    {review.initials}
                  </div>

                  <div className="sw-details-review-content">
                    <div className="sw-details-review-top">
                      <div>
                        <strong>{review.name}</strong>

                        <div className="sw-details-review-rating">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <StarFilled
                              key={index}
                              className={
                                index < review.rating
                                  ? "sw-details-star-active"
                                  : "sw-details-star-inactive"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <span className="sw-details-review-date">
                        {review.date}
                      </span>
                    </div>

                    <p>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="sw-details-review-pagination">
              <Pagination
                current={reviewPage}
                pageSize={reviewsPerPage}
                total={reviewsData.length}
                onChange={(page) => setReviewPage(page)}
                showSizeChanger={false}
                showQuickJumper={false}
                size="small"
              />
            </div>
          </section>
        </div>
      )}
    </>
  );
};

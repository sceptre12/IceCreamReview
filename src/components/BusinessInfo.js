import React, { Fragment } from "react";
import { ListGroup, Spinner } from "react-bootstrap";
import "./businessInfo.css";

const UserReview = ({ review }) => (
  <ListGroup.Item className="review">
    <div className="reviewImgContainer">
      <div
        className="reviewUserImg"
        style={{ backgroundImage: `url(${review.user.image_url})` }}
      />
    </div>
    <div className="reviewContent">
      <div className="userName">{review.user.name}</div>
      <div className="userReview">{review.text}</div>
    </div>
  </ListGroup.Item>
);

const BusinessInfo = ({ topIceCreams, iceCreamBusinesses, selectedItem }) => {
  const { selectedItemId, isLoading } = selectedItem;
  const business = !!topIceCreams[selectedItemId]
    ? topIceCreams[selectedItemId]
    : iceCreamBusinesses[selectedItemId];

  return (
    <div id="businessInfo">
      {!selectedItemId ? (
        <h2>Select a Ice Cream Shop</h2>
      ) : isLoading ? (
        <div className="loadingSpinnerContainer">
          <Spinner animation="border" />
        </div>
      ) : (
        <Fragment>
          <div id="businessImgContainer">
            <div
              id="imgWrapper"
              style={{ backgroundImage: `url(${business.image_url})` }}
            />
          </div>

          <div id="businessContent">
            <h2>{business.name}</h2>
            <p>
              Address: {business.location.address1} | City:{" "}
              {business.location.city}
            </p>
            <div id="reviews">
              <h4>Reviews</h4>
              <div className="dataList">
                <ListGroup>
                  {business.reviews.map((review, index) => (
                    <UserReview key={index} review={review} />
                  ))}
                </ListGroup>
              </div>
            </div>
          </div>
          <div id="businessFooter">
            <a href={business.url}>Grab a Scoop</a>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default BusinessInfo;

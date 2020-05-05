import YelpApi from "../api/yelpApi.js";

const filterOutLowReviews = (business) =>
  business.rating === 5 || business.rating === 4.5;

const sortInDesc = (businessA, businessB) =>
  businessB.review_count - businessA.review_count;

export const processYelpData = async (listOfBusiness) => {
  const yelpApi = new YelpApi();
  let filteredBusinesses = listOfBusiness.filter(filterOutLowReviews);

  filteredBusinesses.sort(sortInDesc);
  if (filteredBusinesses.length > 20) {
    filteredBusinesses = filteredBusinesses.slice(0, 20);
  }

  //Sequentially request each review for the 20 businesses
  for (let business of filteredBusinesses) {
    const response = await (
      await yelpApi.resourceRequest(`${business.id}/reviews`)
    ).json();

    business.reviews = response.reviews;
  }

  filteredBusinesses = filteredBusinesses.filter(
    filterOutBusinessesWithAnyBadReivews
  );
  filteredBusinesses.sort(sortInDesc);

  return filteredBusinesses.slice(0, 5);
};

/*
This function depends on yelp returning the same reviews each time
you request a buisness review. 
*/
const filterOutBusinessesWithAnyBadReivews = (business) => {
  const reviews = business.reviews;
  return !!reviews
    ? reviews.filter((review) => review.rating === 5).length === 3
    : false;
};

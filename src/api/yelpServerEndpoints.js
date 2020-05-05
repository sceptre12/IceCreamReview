/**
 * TODO: this and its endpoint should be expanded
 * to handle getting iceCreamBusinesses coming from
 * different areas
 */
export const getIceCreamBusinesses = () => {
  return getJson(fetch("/getIceCreamBusinesses"));
};

export const getTopIceCreamBusinesses = () => {
  return getJson(fetch("/getTopIceCreamBusinesses"));
};

export const getBusinessReviews = (businessId) => {
  return getJson(
    fetch("/getBusinessReviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessId,
      }),
    })
  );
};

const getJson = async (promise) =>
  await promise.then((result) => result.json());

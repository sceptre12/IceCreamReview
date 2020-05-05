import fetch from "node-fetch";
import { API_KEY } from "../configs/secrets/index.js";

/**
 * Personal Notes
 * The "sort_by" for this api is based on Bayesian average so I won't necessiarly get all
 * the 5 star or 4.5 star rated ice cream shops
 */
class YelpApi {
  constructor(userOptions) {
    this.userOptions = userOptions;
    this.baseUrl = "https://api.yelp.com/v3/businesses/";
  }

  resourceRequest = async (requestType, searchParams = {}) => {
    const url = new URL(this.baseUrl + requestType);
    const userOptions = this.userOptions || {};
    url.search = new URLSearchParams({
      ...searchParams,
      ...userOptions,
    });
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  };

  /**
   * TODO Have the user pass in the location
   */
  getIceCreamBusinesses = async (offset = 0, limit = 50) => {
    return this.resourceRequest("search", {
      location: "Alpharetta, Georgia",
      categories: "icecream",
      sort_by: "rating",
      limit,
      offset,
    });
  };

  getAllIceCreamBusinesses = async () => {
    return this._searchUntilDone(this.getIceCreamBusinesses);
  };

  _searchUntilDone = async (initialRequest) => {
    let results = [];
    let currentTotal = 0;
    let currentOffset = 0;
    while (true) {
      const response = await (await initialRequest(currentOffset)).json();
      if (response.total) {
        currentOffset += response.businesses.length;
        currentTotal = response.total;
        results = results.concat(response.businesses);
      }
      if (currentOffset === currentTotal) {
        break;
      }
    }
    return results;
  };
}

export default YelpApi;

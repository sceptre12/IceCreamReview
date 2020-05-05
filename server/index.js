import express from "express";
import bodyParser from "body-parser";

// Api's
import YelpApi from "./api/yelpApi.js";

// Processors
import { processYelpData } from "./dataProcessors/yelpBusinessProcessors.js";

// Cache
import { DATA_CACHE } from "./cache/data.js";

// Enums
import { TOP_ICECREAMS, ALL_ICRECREAMS } from "./configs/constants/index.js";

const app = express();
app.use(bodyParser.json());

const port = 5000;

const businessSearch = new YelpApi();
/**
 * TODO find common functions and create util package to host that cod
 */
app.get("/getIceCreamBusinesses", (req, res, next) => {
  businessSearch
    .getIceCreamBusinesses()
    .then((result) => result.json())
    .then((final) => res.send(final))
    .catch((err) => next(err));
});

app.post("/getBusinessReviews", (req, res, next) => {
  const businessId = req.body.businessId;
  if (businessId) {
    businessSearch
      .resourceRequest(`${businessId}/reviews`)
      .then((result) => result.json())
      .then((final) => {
        res.send(final);
      })
      .catch((err) => next(err));
  } else {
    res.send({ error: true, message: "No Id was sent" });
  }
});

app.get("/getAllIceCreamBusinesses", (req, res, next) => {
  if (DATA_CACHE.has(ALL_ICRECREAMS)) {
    res.send(DATA_CACHE.get(ALL_ICRECREAMS));
  } else {
    businessSearch
      .getAllIceCreamBusinesses()
      .then((result) => {
        res.send(result);
        DATA_CACHE.set(ALL_ICRECREAMS, result);
      })
      .catch((err) => next(err));
  }
});

app.get("/getTopIceCreamBusinesses", (req, res, next) => {
  if (DATA_CACHE.has(TOP_ICECREAMS)) {
    res.send(DATA_CACHE.get(TOP_ICECREAMS));
  } else {
    businessSearch
      .getAllIceCreamBusinesses()
      .then((result) => processYelpData(result))
      .then((final) => {
        res.send(final);
        DATA_CACHE.set(TOP_ICECREAMS, final);
      })
      .catch((err) => next(err));
  }
});

app.listen(port, () => console.log(`MIC CHECK: ${port}`));

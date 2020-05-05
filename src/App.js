import React, { useState, useEffect } from "react";
import { Jumbotron, ListGroup, Spinner } from "react-bootstrap";

import BusinessInfo from "./components/BusinessInfo";

// Api Endpoints
import {
  getIceCreamBusinesses,
  getTopIceCreamBusinesses,
  getBusinessReviews,
} from "./api/yelpServerEndpoints";
import "./App.css";

/**
 * NOTE Times like this Typescript would be much appreciated
 * @param {*} data
 */
const IceCreamListItem = ({ name, id, reviews, updateSelectedItem }) => {
  return (
    <ListGroup.Item action onClick={updateSelectedItem.bind(null, id, reviews)}>
      {name}
    </ListGroup.Item>
  );
};

const defaultDataState = {
  data: [],
  isLoading: true,
};

function App() {
  // State management
  const [iceCreamBusinesses, setIceCreamBusinesses] = useState({
    ...defaultDataState,
  });
  const [allIceCreamBusinesses, setAllIceCreamBusinesses] = useState({
    ...defaultDataState,
  });
  const [topIceCreams, setTopIceCreamBusiness] = useState({
    ...defaultDataState,
  });

  /*
    By default we already have the business information
    However two things should be noted:
    1) The top 5 Ice cream result set contains that business's reviews
    2) The normal ice cream business search does not contain the reviews

    I would need to make sure I check to see if the review object is on the
    result set to determine if I need to query for it or not. 
  */
  const [selectedItem, setSelectedItem] = useState({
    selectedItemId: undefined,
    isLoading: false,
  });

  // Runs on the first mount
  useEffect(() => {
    getIceCreamBusinesses().then((result) =>
      setIceCreamBusinesses({
        data: result.businesses.reduce(
          (data, current) => ({ ...data, [current.id]: current }),
          {}
        ),
        isLoading: false,
      })
    );

    getTopIceCreamBusinesses().then((data) =>
      setTopIceCreamBusiness({
        data: data.reduce(
          (obj, current) => ({ ...obj, [current.id]: current }),
          {}
        ),
        isLoading: false,
      })
    );
  }, []);

  // Runs when second param value changing
  useEffect(() => {
    if (selectedItem.isLoading) {
      getBusinessReviews(selectedItem.selectedItemId).then((result) => {
        // Update data
        setIceCreamBusinesses({
          data: {
            ...iceCreamBusinesses.data,
            [selectedItem.selectedItemId]: {
              ...iceCreamBusinesses.data[selectedItem.selectedItemId],
              reviews: result.reviews,
            },
          },
          isLoading: false,
        });

        // Update state info
        setSelectedItem({
          ...selectedItem,
          isLoading: false,
        });
      });
    }
  }, [selectedItem.isLoading]);

  const updateSelectedItem = (id, reviews) => {
    setSelectedItem({
      selectedItemId: id,
      isLoading: !reviews,
    });
  };

  return (
    <div className="App">
      <Jumbotron id="header">
        <h1>Get Yourrrrr Ice Creams Alpharetta style</h1>
      </Jumbotron>
      <main id="main">
        <div id="listPanel">
          <div id="topIceCream">
            <h3>Top 5 Ice Cream Shops!</h3>
            <div className={"dataList"}>
              <ListGroup>
                {topIceCreams.isLoading ? (
                  <div className="loadingSpinnerContainer">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  Object.keys(topIceCreams.data).map((key, index) => (
                    <IceCreamListItem
                      key={index}
                      {...topIceCreams.data[key]}
                      updateSelectedItem={updateSelectedItem}
                    />
                  ))
                )}
              </ListGroup>
            </div>
          </div>
          <hr />
          <div id="otherIceCreams">
            <h3>Other Ice Cream Shops</h3>
            <div className={"dataList"}>
              <ListGroup>
                {iceCreamBusinesses.isLoading ? (
                  <div className="loadingSpinnerContainer">
                    <Spinner animation="border" />
                  </div>
                ) : (
                  Object.keys(iceCreamBusinesses.data).map((key, index) => (
                    <IceCreamListItem
                      key={index}
                      {...iceCreamBusinesses.data[key]}
                      updateSelectedItem={updateSelectedItem}
                    />
                  ))
                )}
              </ListGroup>
            </div>
          </div>
        </div>
        <div id="contentPanel">
          <BusinessInfo
            {...{
              topIceCreams: topIceCreams.data,
              iceCreamBusinesses: iceCreamBusinesses.data,
              selectedItem,
            }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

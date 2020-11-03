import React, { useState, useEffect } from "react";
import "./App.css";

// SEE README FOR INSTRUCTIONS

function App() {
  const [stateObjOfListIds, updateStateObjOfListIds] = useState(() => {});
  const [errors, updateErrors] = useState(() => "");
  useEffect(() => {
    fetch(
      "https://cors-anywhere.herokuapp.com/https://fetch-hiring.s3.amazonaws.com/hiring.json"
    )
      .then((res) => res.json())
      .then((data) => {
        const objOfDataArrs = {};
        data.forEach((datum) => {
          // filters out falsey names such as empty string or null, meeting the third requirement
          if (datum.name) {
            // either set the key to list id and value to an array if not already included as key
            // or push new value
            objOfDataArrs[datum.listId] = objOfDataArrs[datum.listId]
              ? [...objOfDataArrs[datum.listId], datum]
              : [datum];
          }
        });

        updateStateObjOfListIds(objOfDataArrs);
      })
      // if it has an error, update state to inform the user
      .catch(() => {
        updateErrors(
          "We could not find the resource. Please refresh or check back later"
        );
      });
  }, []);

  function mapArrToList(arrOfItems) {
    return arrOfItems.map((item) => {
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.listId}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
  }

  // guard clause for errors
  if (errors) {
    return errors;
  }

  // guard clause for first render or potential error
  if (!stateObjOfListIds) {
    return "Please wait while we grab the items";
  }

  // first sort list Ids. Prettier won't make this one line
  const sortedArrOfListIds = Object.keys(stateObjOfListIds).sort(
    (a, b) => a - b
  );

  // key into state obj with list id then sort array of items then map array to table row
  // then return that information in a table, meeting the first and second bullet point requirements
  const stylizedArrToTable = sortedArrOfListIds.map((num) => {
    const arrInStateObjOfListIds = stateObjOfListIds[num];
    return (
      // key for improving React Fiber and the diffing algo of the Virtual DOM
      <div key={num}>
        <h1> List Id {parseInt(num)}</h1>
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>List Id</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {/* in this case, every truthy item name is "Item item's id" so we can just sort by id. If that wasn't the case,
  // I'd do a normal comparison alphabetically by name, bullet point 2 */}
            {mapArrToList(arrInStateObjOfListIds.sort((a, b) => a.id - b.id))}
          </tbody>
        </table>
      </div>
    );
  });

  return (
    <div className="App">
      <h1>Hello Fetch Rewards</h1>
      {stylizedArrToTable}
    </div>
  );
}

export default App;

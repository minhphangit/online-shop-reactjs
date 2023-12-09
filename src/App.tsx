import React from "react";
import logo from "./logo.svg";
import Numeral from "numeral";
import "numeral/locales/vi";
import "./App.css";
import OnlineShop from "./components/OnlineShopRouter";

Numeral.locale("vi");
function App() {
  return (
    <div>
      <OnlineShop />
    </div>
  );
}

export default App;

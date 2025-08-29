import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./util/axios.customize";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const fetchHelloWorld = async () => {
      const res = await axios.get(`/v1/api`);
      console.log(res);
    };
    fetchHelloWorld();
  }, []);

  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;

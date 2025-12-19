import { Route, Routes } from "react-router-dom";
import PhotoBooth from "./pages/PhotoBooth";

function Router() {
  return (
    <Routes>
      <Route path={"/"} element={<PhotoBooth />} />
      {/* <Route path={"/404"} component={NotFound} /> */}
      {/* Final fallback route */}
      {/* <Route component={NotFound} /> */}
    </Routes>
  );
}

function App() {
  return <Router />;
}

export default App;

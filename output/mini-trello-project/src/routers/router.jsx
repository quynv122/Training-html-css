
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import BoardPageContainer from './../pages/board/BoardPageContainer';


export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<BoardPageContainer />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

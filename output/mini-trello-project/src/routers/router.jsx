
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Board from '../components/board/Board';


export default function RouterApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Board/>} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
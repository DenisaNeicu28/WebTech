import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Add from './components/Add';
import AdaugaCopil from './components/AdaugaCopil';
import './App.css';
import Expiring from './components/Expiring';

export default function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/expiring" element={<Expiring />} />
          <Route path="/add" element={<Add />} />
          <Route path="/add/:id/copil" element={<AdaugaCopil />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

// Exemplo de src/routes/AppRoutes.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnimalList from '../pages/AnimalList/AnimalList';
import DietaList from '../pages/DietaList/DietaList';
import AlimentoList from '../pages/AlimentoList/AlimentoList';
import LoteList from '../pages/LoteList/LoteList';
import ProducaoLeiteList from '../pages/ProducaoLeiteList/ProducaoLeiteList'; // Importar a nova página
import Sidebar from '../components/Sidebar/Sidebar';
import styles from './AppRoutes.module.scss';

const AppRoutes: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className={styles.container}>
        <Sidebar />
        <div className={styles.content}>
          <Routes>
            <Route path="/" element={<AnimalList />} />
            <Route path="/animais" element={<AnimalList />} />
            <Route path="/dietas" element={<DietaList />} />
            <Route path="/alimentos" element={<AlimentoList />} />
            <Route path="/lotes" element={<LoteList />} />
            <Route
              path="/producao-leite"
              element={<ProducaoLeiteList />}
            />{' '}
            {/* Nova rota */}
            {/* Outras rotas */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRoutes;

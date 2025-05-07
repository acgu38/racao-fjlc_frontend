import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaPaw,
  FaUtensils,
  FaSeedling,
  FaLayerGroup,
  FaTint,
} from 'react-icons/fa';
import styles from './Sidebar.module.scss';

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Rações FJLC</h2>
      <ul>
        <li>
          <Link to="/animais">
            <FaPaw className={styles.icon} />
            Animais
          </Link>
        </li>
        <li>
          <Link to="/dietas">
            <FaUtensils className={styles.icon} />
            Dietas
          </Link>
        </li>
        <li>
          <Link to="/alimentos">
            <FaSeedling className={styles.icon} />
            Alimentos
          </Link>
        </li>
        <li>
          <Link to="/lotes">
            <FaLayerGroup className={styles.icon} />
            Lotes
          </Link>
        </li>
        <li>
          <Link to="/producao-leite">
            <FaTint className={styles.icon} />
            Produção de Leite
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;

// Exemplo de src/components/AnimalCard.tsx
import React from 'react';

interface CardProps {
  nome: string;
  estagioProducao: string;
  producaoDiariaLeite: number;
}

const Card: React.FC<CardProps> = ({
  nome,
  estagioProducao,
  producaoDiariaLeite,
}) => {
  return (
    <div className="animal-card">
      <h3>{nome}</h3>
      <p>Estágio: {estagioProducao}</p>
      <p>Produção Diária: {producaoDiariaLeite} litros</p>
    </div>
  );
};

export default Card;

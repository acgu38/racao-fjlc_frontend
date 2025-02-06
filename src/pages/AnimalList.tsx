// Exemplo de src/pages/AnimalList.tsx
import React, { useEffect, useState } from 'react';
import { getAnimais } from '../api/animalService';
import Card from '../components/Card';

const AnimalList: React.FC = () => {
  const [animais, setAnimais] = useState<any[]>([]);

  useEffect(() => {
    getAnimais().then(data => setAnimais(data));
  }, []);

  return (
    <div>
      <h1>Lista de Animais</h1>
      {animais.map(animal => (
        <Card
          key={animal.id}
          nome={animal.nome}
          estagioProducao={animal.estagioProducao}
          producaoDiariaLeite={animal.producaoDiariaLeite}
        />
      ))}
    </div>
  );
};

export default AnimalList;

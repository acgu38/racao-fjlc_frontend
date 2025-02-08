// Exemplo de src/pages/AnimalList.tsx
import React, { useEffect, useState } from 'react';
import { getAnimais } from '../api/animalService';
import DataTable from '../components/DataTable/DataTable';

interface Animal {
  id: string;
  nome: string;
  estagioProducao: string;
  producaoDiariaLeite: number;
}

const AnimalList: React.FC = () => {
  const [animais, setAnimais] = useState<Animal[]>([]);

  useEffect(() => {
    getAnimais().then((data) => setAnimais(data));
  }, []);

  const columns: { header: string; accessor: keyof Animal }[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Estágio de Produção', accessor: 'estagioProducao' },
    {
      header: 'Produção Diária de Leite (litros)',
      accessor: 'producaoDiariaLeite',
    },
  ];

  const actionButtons = [
    {
      label: 'Editar',
      onClick: (animal: Animal) => {
        // Lógica para editar o animal
        console.log('Editando', animal);
      },
    },
    {
      label: 'Excluir',
      onClick: (animal: Animal) => {
        // Lógica para excluir o animal
        console.log('Excluindo', animal);
      },
    },
    {
      label: 'Exportar',
      onClick: (animal: Animal) => {
        // Lógica para exportar o animal
        console.log('Exportando', animal);
      },
    },
  ];

  return (
    <div>
      <h1>Lista de Animais</h1>
      <DataTable
        data={animais}
        columns={columns}
        actionButtons={actionButtons}
      />
    </div>
  );
};

export default AnimalList;

import React, { useEffect, useState, useCallback } from 'react';
import {
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getEstagiosProducao,
  getAnimaisComProducao,
} from '../../api/animalService';
import { Animal } from '../../models/Animal';
import { useNavigate } from 'react-router-dom';
import styles from './AnimalList.module.scss';
import DataTable from '../../components/DataTable/DataTable';
import GenericModal from '../../components/GenericModal/GenericModal';

const AnimalList: React.FC = () => {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [estagiosProducao, setEstagiosProducao] = useState<string[]>([]);
  const navigate = useNavigate();

  const fetchAnimais = useCallback(async () => {
    const data = await getAnimaisComProducao(7);
    data.forEach((animal) => {
      const estagioIndex = Number(animal.estagioProducao);
      if (!isNaN(estagioIndex)) {
        animal.estagioProducao = estagiosProducao[estagioIndex];
      }
    });
    setAnimais(data);
  }, [estagiosProducao]);

  const fetchEstagiosProducao = useCallback(async () => {
    const data = await getEstagiosProducao();
    setEstagiosProducao(data);
  }, []);

  useEffect(() => {
    fetchEstagiosProducao();
  }, [fetchEstagiosProducao]);

  useEffect(() => {
    if (estagiosProducao.length > 0) {
      fetchAnimais();
    }
  }, [fetchAnimais, estagiosProducao]);

  const handleOpenModal = (animal: Animal | null = null) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
  };


  const handleCreateOrUpdateAnimal = async (data: Animal) => {
    if (selectedAnimal) {
      await updateAnimal(selectedAnimal._id, data);
    } else {
      await createAnimal(data);
    }
    fetchAnimais();
    handleCloseModal();
  };

  const handleDeleteAnimal = async (animalId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este animal?')) {
      await deleteAnimal(animalId);
      fetchAnimais();
    }
  };

  const handleRegistrarProducao = (animal: Animal) => {
    navigate(`/producao-leite?animalId=${animal._id}`);
  };

  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Estágio de Produção', accessor: 'estagioProducao' },
    { header: 'Produção Diária de Leite (l)', accessor: 'producaoDiariaLeite' },
  ];

  const actionButtons = [
    {
      label: 'Editar',
      onClick: (animal: Animal) => handleOpenModal(animal),
    },
    {
      label: 'Registrar Produção',
      onClick: (animal: Animal) => handleRegistrarProducao(animal),
    },
    {
      label: 'Excluir',
      onClick: (animal: Animal) => handleDeleteAnimal(animal.id),
    },
  ];

  const modalFields = [
    {
      label: 'Nome',
      type: 'text',
      name: 'nome',
      required: true,
      value: selectedAnimal?.nome || '',
    },
    {
      label: 'Data de Nascimento',
      type: 'date',
      name: 'dataNascimento',
      required: true,
      value: selectedAnimal?.dataNascimento || '',
    },
    {
      label: 'Estágio de Produção',
      type: 'select',
      name: 'estagioProducao',
      required: true,
      options: estagiosProducao.map((estagio) => ({
        label: estagio,
        value: estagio,
      })),
      value: selectedAnimal?.estagioProducao || estagiosProducao[0],
    },
    {
      label: 'Produção Diária de Leite (l)',
      type: 'number',
      name: 'producaoDiariaLeite',
      required: true,
      value: selectedAnimal?.producaoDiariaLeite || 0,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Animais</h1>
      <button className={styles.addButton} onClick={() => handleOpenModal()}>
        Cadastrar Novo Animal
      </button>
      <DataTable
        data={animais}
        columns={columns}
        actionButtons={actionButtons}
      />
      {isModalOpen && (
        <GenericModal
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdateAnimal}
          title={
            selectedAnimal ? 'Editar Animal' : 'Cadastrar Novo Animal'
          }
          fields={modalFields}
        />
      )}
    </div>
  )
};

export default AnimalList;

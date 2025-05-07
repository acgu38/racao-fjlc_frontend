import React, { useCallback, useEffect, useState } from 'react';
import {
  getProducaoLeite,
  createProducaoLeite,
  updateProducaoLeite,
} from '../../api/producaoLeite';
import { getAnimaisPorIds, getAnimais } from '../../api/animalService';
import { Animal } from '../../models/Animal';
import DataTable from '../../components/DataTable/DataTable';
import GenericModal from '../../components/GenericModal/GenericModal';
import { useLocation } from 'react-router-dom';
import styles from './ProducaoLeiteList.module.scss';

const ProducaoLeiteList: React.FC = () => {
  const [producoes, setProducoes] = useState([]);
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducao, setSelectedProducao] = useState<any>(null);
  const location = useLocation();

  const fetchAnimais = async (producoes: any[]) => {
    const animalIds = producoes.map((producao) => producao.animal);
    const animais = await getAnimaisPorIds(animalIds);
    return animais;
  };

  const fetchProducoes = useCallback(async () => {
    const producoesData = await getProducaoLeite();
    const animaisData = await fetchAnimais(producoesData);
    const producoesComAnimais = producoesData.map(
      (producao: { animal: any; dataHora: string }) => {
        const animal = animaisData.find(
          (animal: Animal) => animal._id === producao.animal
        );
        const dataHora = new Date(producao.dataHora);
        return {
          ...producao,
          animalNome: animal ? animal.nome : 'Desconhecido',
          data: dataHora.toLocaleDateString(),
          hora: dataHora.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
        };
      }
    );
    setProducoes(producoesComAnimais);
  }, []);

  const fetchAnimaisData = useCallback(async () => {
    const animaisData = await getAnimais();
    setAnimais(animaisData);
  }, []);

  useEffect(() => {
    fetchProducoes();
    fetchAnimaisData();
  }, [fetchProducoes, fetchAnimaisData]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const animalId = params.get('animalId');
    if (animalId) {
      setSelectedProducao({ animalId });
      setIsModalOpen(true);
    }
  }, [location.search]);

  const handleOpenModal = () => {
    setSelectedProducao(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateOrUpdateProducao = async (data: any) => {
    const { data: date, hora: time, ...rest } = data;
    const timestamp = new Date(`${date}T${time}`).toISOString();
    const requestData = { ...rest, dataHora: timestamp };

    if (selectedProducao) {
      await updateProducaoLeite(selectedProducao._id, requestData);
    } else {
      await createProducaoLeite(requestData);
    }
    fetchProducoes();
    handleCloseModal();
  };

  const columns = [
    { header: 'Nome do Animal', accessor: 'animalNome' },
    { header: 'Quantidade de Leite (L)', accessor: 'quantidade' },
    { header: 'Data', accessor: 'data' },
    { header: 'Hora', accessor: 'hora' },
  ];

  const modalFields = [
    {
      label: 'Animal',
      type: 'select',
      name: 'animalId',
      options: animais.map((animal) => ({
        label: animal.nome,
        value: animal._id,
      })),
      required: true,
      value: selectedProducao?.animalId || '',
    },
    {
      label: 'Quantidade de Leite (L)',
      type: 'number',
      name: 'quantidade',
      required: true,
    },
    {
      label: 'Data',
      type: 'date',
      name: 'data',
      required: true,
    },
    {
      label: 'Hora',
      type: 'time',
      name: 'hora',
      required: true,
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Produção de Leite</h1>
      <button className={styles.addButton} onClick={handleOpenModal}>
        Registrar Nova Produção
      </button>
      <DataTable data={producoes} columns={columns} />
      {isModalOpen && (
        <GenericModal
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdateProducao}
          title="Registrar Nova Produção"
          fields={modalFields}
        />
      )}
    </div>
  );
};

export default ProducaoLeiteList;

import React, { useEffect, useState } from 'react';
import {
  getDietas,
  createDieta,
  updateDieta,
  deleteDieta,
} from '../../api/dietaService';
import { getCategorias, getAlimentos } from '../../api/alimentoService';
import DataTable from '../../components/DataTable/DataTable';
import GenericModal from '../../components/GenericModal/GenericModal';
import { Dieta } from '../../models/Dieta';
import { Alimento } from '../../models/Alimento';
import styles from './DietaList.module.scss';

const DietaList: React.FC = () => {
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [categorias, setCategorias] = useState<
    { value: string; label: string }[]
  >([]);
  const [alimentos, setAlimentos] = useState<
    { value: string; label: string }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDieta, setSelectedDieta] = useState<Dieta | null>(null);

  useEffect(() => {
    fetchDietas();
    fetchCategorias();
    fetchAlimentos();
  }, []);

  const fetchDietas = async () => {
    const data = await getDietas();
    setDietas(data);
  };

  const fetchCategorias = async () => {
    const data = await getCategorias();
    setCategorias(
      data.map((categoria: string) => ({ value: categoria, label: categoria }))
    );
  };

  const fetchAlimentos = async () => {
    const data = await getAlimentos();
    setAlimentos(
      data.map((alimento: Alimento) => ({
        value: alimento._id,
        label: alimento.nome,
      }))
    );
  };

  const handleOpenModal = (dieta: Dieta | null = null) => {
    setSelectedDieta(dieta);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDieta(null);
  };

  const handleCreateOrUpdateDieta = async (data: Dieta) => {
    console.log(data);

    if (selectedDieta) {
      await updateDieta(selectedDieta._id, data);
    } else {
      await createDieta(data);
    }
    fetchDietas();
    handleCloseModal();
  };

  const handleDeleteDieta = async (dietaId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta dieta?')) {
      await deleteDieta(dietaId);
      fetchDietas();
    }
  };

  const columns: { header: string; accessor: keyof Dieta }[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Descrição', accessor: 'descricao' },
  ];

  const actionButtons = [
    {
      label: 'Editar',
      onClick: (dieta: Dieta) => handleOpenModal(dieta),
    },
    {
      label: 'Excluir',
      onClick: (dieta: Dieta) => handleDeleteDieta(dieta.id),
    },
  ];

  const modalFields = [
    {
      label: 'Nome',
      type: 'text',
      name: 'nome',
      required: true,
      value: selectedDieta?.nome || '',
    },
    {
      label: 'Descrição',
      type: 'text',
      name: 'descricao',
      required: true,
      value: selectedDieta?.descricao || '',
    },
    {
      label: 'Módulos',
      type: 'dynamicTable',
      name: 'modulos',
      buttonLabel: 'Adicionar Módulo',
      fields: [
        {
          label: 'Categoria',
          type: 'select',
          name: 'categoria',
          options: categorias,
        },
        {
          label: 'Componentes',
          type: 'dynamicTable',
          name: 'componentes',
          buttonLabel: 'Adicionar Componente',
          fields: [
            { label: 'Nome', type: 'text', name: 'nome' },
            { label: 'Quantidade', type: 'number', name: 'quantidade' },
            {
              label: 'Unidade de Medida',
              type: 'text',
              name: 'unidadeMedida',
            },
            {
              label: 'Alimento',
              type: 'select',
              name: 'alimento',
              options: alimentos,
            },
          ],
        },
      ],
      value: selectedDieta?.modulos || [],
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Dietas</h1>
      <button className={styles.addButton} onClick={() => handleOpenModal()}>
        Cadastrar Nova Dieta
      </button>
      <DataTable
        data={dietas}
        columns={columns}
        actionButtons={actionButtons}
      />
      {isModalOpen && (
        <GenericModal
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdateDieta}
          title={selectedDieta ? 'Editar Dieta' : 'Cadastrar Nova Dieta'}
          fields={modalFields}
        />
      )}
    </div>
  );
};

export default DietaList;

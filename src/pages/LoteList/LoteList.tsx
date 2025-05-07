import React, { useEffect, useState } from 'react';
import {
  getLotes,
  createLote,
  updateLote,
  deleteLote,
} from '../../api/loteService';
import DataTable from '../../components/DataTable/DataTable';
import GenericModal from '../../components/GenericModal/GenericModal';
import { Lote } from '../../models/Lote';
import { Dieta } from '../../models/Dieta';
import styles from './LoteList.module.scss';
import { getDietas } from '../../api/dietaService';

const LoteList: React.FC = () => {
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  useEffect(() => {
    fetchLotes();
    fetchDietas();
  }, []);

  const fetchLotes = async () => {
    const data = await getLotes();
    setLotes(data);
  };

  const fetchDietas = async () => {
    const data = await getDietas();
    setDietas(data);
  };

  const handleOpenModal = (lote: Lote | null = null) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLote(null);
  };

  const handleCreateOrUpdateLote = async (data: Lote) => {
    if (selectedLote) {
      await updateLote(selectedLote._id, data);
    } else {
      await createLote(data);
    }
    fetchLotes();
    handleCloseModal();
  };

  const handleDeleteLote = async (loteId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este lote?')) {
      await deleteLote(loteId);
      fetchLotes();
    }
  };

  const columns: { header: string; accessor: keyof Lote | string }[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Dieta', accessor: 'dieta.nome' },
    { header: 'Quantidade de Animais', accessor: 'animais.length' },
  ];

  const actionButtons = [
    {
      label: 'Editar',
      onClick: (lote: Lote) => handleOpenModal(lote),
    },
    {
      label: 'Excluir',
      onClick: (lote: Lote) => handleDeleteLote(lote.id),
    },
  ];

  const modalFields = [
    {
      label: 'Nome',
      type: 'text',
      name: 'nome',
      required: true,
      value: selectedLote?.nome || '',
    },
    {
      label: 'Dieta',
      type: 'select',
      name: 'dieta',
      required: true,
      options: dietas.map((dieta) => ({ label: dieta.nome, value: dieta.id })),
      value: selectedLote?.dieta?.id || '',
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Lotes</h1>
      <button className={styles.addButton} onClick={() => handleOpenModal()}>
        Cadastrar Novo Lote
      </button>
      <DataTable data={lotes} columns={columns} actionButtons={actionButtons} />
      {isModalOpen && (
        <GenericModal
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdateLote}
          title={selectedLote ? 'Editar Lote' : 'Cadastrar Novo Lote'}
          fields={modalFields}
        />
      )}
    </div>
  );
};

export default LoteList;

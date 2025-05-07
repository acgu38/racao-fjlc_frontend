import React, { useEffect, useState } from 'react';
import {
  getAlimentos,
  createAlimento,
  updateAlimento,
  deleteAlimento,
  getCategorias,
} from '../../api/alimentoService';
import DataTable from '../../components/DataTable/DataTable';
import GenericModal from '../../components/GenericModal/GenericModal';
import { Alimento } from '../../models/Alimento';
import styles from './AlimentoList.module.scss';

const AlimentoList: React.FC = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAlimento, setSelectedAlimento] = useState<Alimento | null>(
    null
  );

  useEffect(() => {
    fetchAlimentos();
    fetchCategorias();
  }, []);

  const fetchAlimentos = async () => {
    const data = await getAlimentos();
    setAlimentos(data);
  };

  const fetchCategorias = async () => {
    const data = await getCategorias();
    setCategorias(data);
  };

  const handleOpenModal = (alimento: Alimento | null = null) => {
    setSelectedAlimento(alimento);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlimento(null);
  };

  const handleCreateOrUpdateAlimento = async (data: Alimento) => {
    console.log('data');
    console.log(data);

    // Convertendo disponibilidade para booleano
    data.disponibilidade =
      (data.disponibilidade as unknown as string) === 'Disponível';

    if (selectedAlimento) {
      await updateAlimento(selectedAlimento._id, data);
    } else {
      await createAlimento(data);
    }
    fetchAlimentos();
    handleCloseModal();
  };

  const handleDeleteAlimento = async (alimentoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este alimento?')) {
      await deleteAlimento(alimentoId);
      fetchAlimentos();
    }
  };

  const columns: { header: string; accessor: keyof Alimento }[] = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Categoria', accessor: 'categoria' },
    { header: 'Disponibilidade', accessor: 'disponibilidade' },
  ];

  const actionButtons = [
    {
      label: 'Editar',
      onClick: (alimento: Alimento) => handleOpenModal(alimento),
    },
    {
      label: 'Excluir',
      onClick: (alimento: Alimento) => handleDeleteAlimento(alimento.id),
    },
  ];

  const modalFields = [
    {
      label: 'Nome',
      type: 'text',
      name: 'nome',
      required: true,
      value: selectedAlimento?.nome || '',
    },
    {
      label: 'Energia Metabolizável',
      type: 'number',
      name: 'energiaMetabolizavel',
      required: true,
      value: selectedAlimento?.energiaMetabolizavel || '',
    },
    {
      label: 'Matéria Seca',
      type: 'number',
      name: 'materiaSeca',
      required: true,
      value: selectedAlimento?.materiaSeca || '',
    },
    {
      label: 'Proteína Bruta',
      type: 'number',
      name: 'proteinaBruta',
      required: true,
      value: selectedAlimento?.proteinaBruta || '',
    },
    {
      label: 'Fibra Detergente Neutro',
      type: 'number',
      name: 'fibraDetergenteNeutro',
      required: true,
      value: selectedAlimento?.fibraDetergenteNeutro || '',
    },
    {
      label: 'Lignina',
      type: 'number',
      name: 'lignina',
      required: true,
      value: selectedAlimento?.lignina || '',
    },
    {
      label: 'Nutrientes Digestíveis Totais',
      type: 'number',
      name: 'nutrientesDigestiveisTotais',
      required: true,
      value: selectedAlimento?.nutrientesDigestiveisTotais || '',
    },
    {
      label: 'Categoria',
      type: 'select',
      name: 'categoria',
      required: false,
      options: categorias.map((categoria) => ({ value: categoria, label: categoria })), // Use the fetched categories
      value: selectedAlimento?.categoria || categorias[0],
    },
    {
      label: 'Preço',
      type: 'number',
      name: 'preco',
      required: true,
      value: selectedAlimento?.preco || '',
    },
    {
      label: 'Disponibilidade',
      type: 'select',
      name: 'disponibilidade',
      required: true,
      options: [
        { value: 'Disponível', label: 'Disponível' },
        { value: 'Indisponível', label: 'Indisponível' },
      ],
      value: selectedAlimento?.disponibilidade ? 'Disponível' : 'Indisponível',
    },
  ];

  const transformAlimentos = (alimentos: Alimento[]): any[] => {
    return alimentos.map((alimento) => ({
      ...alimento,
      disponibilidade: alimento.disponibilidade ? 'Disponível' : 'Indisponível',
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Alimentos</h1>
      <button className={styles.addButton} onClick={() => handleOpenModal()}>
        Cadastrar Novo Alimento
      </button>
      <DataTable
        data={transformAlimentos(alimentos)}
        columns={columns}
        actionButtons={actionButtons}
      />
      {isModalOpen && (
        <GenericModal
          onClose={handleCloseModal}
          onSubmit={handleCreateOrUpdateAlimento}
          title={
            selectedAlimento ? 'Editar Alimento' : 'Cadastrar Novo Alimento'
          }
          fields={modalFields}
        />
      )}
    </div>
  );
};

export default AlimentoList;

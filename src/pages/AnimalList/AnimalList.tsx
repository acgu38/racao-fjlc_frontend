import React, { useEffect, useState, useCallback } from 'react';
import {
  createAnimal,
  updateAnimal,
  deleteAnimal,
  getEstagiosProducao,
  getAnimaisComProducao,
} from '../../api/animalService';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Animal } from '../../models/Animal';
import { useNavigate } from 'react-router-dom';
import styles from './AnimalList.module.scss';

const AnimalList: React.FC = () => {
  const [animais, setAnimais] = useState<Animal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [estagiosProducao, setEstagiosProducao] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentAnimal, setCurrentAnimal] = useState<Animal | null>(null);
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

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    animal: Animal
  ) => {
    setAnchorEl(event.currentTarget);
    setCurrentAnimal(animal);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentAnimal(null);
  };

  const columns = [
    { header: 'Nome', accessor: 'nome' },
    { header: 'Estágio de Produção', accessor: 'estagioProducao' },
    { header: 'Produção Diária de Leite (l)', accessor: 'producaoDiariaLeite' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lista de Animais</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
      >
        Cadastrar Novo Animal
      </Button>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.accessor}>{column.header}</TableCell>
              ))}
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {animais.map((animal) => (
              <TableRow key={animal._id}>
                {columns.map((column) => (
                  <TableCell key={column.accessor}>
                    {animal[column.accessor]}
                  </TableCell>
                ))}
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => handleMenuClick(event, animal)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleOpenModal(animal)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDeleteAnimal(animal._id)}>
                      Excluir
                    </MenuItem>
                    <MenuItem onClick={() => handleRegistrarProducao(animal)}>
                      Registrar Produção
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {selectedAnimal ? 'Editar Animal' : 'Cadastrar Novo Animal'}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            type="text"
            name="nome"
            required
            fullWidth
            margin="normal"
            value={selectedAnimal?.nome || ''}
            onChange={(e) => {
              if (selectedAnimal) {
                setSelectedAnimal({ ...selectedAnimal, nome: e.target.value });
              }
            }}
          />
          <TextField
            label="Data de Nascimento"
            type="date"
            name="dataNascimento"
            required
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={selectedAnimal?.dataNascimento || ''}
            onChange={(e) => {
              if (selectedAnimal) {
                setSelectedAnimal({
                  ...selectedAnimal,
                  dataNascimento: e.target.value,
                });
              }
            }}
          />
          <Select
            label="Estágio de Produção"
            name="estagioProducao"
            required
            fullWidth
            value={selectedAnimal?.estagioProducao || ''}
            onChange={(e) => {
              if (selectedAnimal) {
                setSelectedAnimal({
                  ...selectedAnimal,
                  estagioProducao: e.target.value as string,
                });
              }
            }}
          >
            {estagiosProducao.map((estagio) => (
              <MenuItem key={estagio} value={estagio}>
                {estagio}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={() => handleCreateOrUpdateAnimal(selectedAnimal as Animal)}
            color="primary"
          >
            {selectedAnimal ? 'Salvar' : 'Cadastrar'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AnimalList;

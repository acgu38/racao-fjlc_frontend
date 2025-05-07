import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './GenericModal.module.scss';
import DynamicTable from '../DynamicTable/DynamicTable';
import { GenericModel } from '../../models/Types';

type FieldConfigOptions = { value: string; label: string }[];

interface FieldConfig {
  label: string;
  type: string;
  name: string;
  required?: boolean;
  value?: any;
  options?: FieldConfigOptions;
  fields?: FieldConfig[];
  buttonLabel?: string;
}

interface GenericModalProps<T extends GenericModel> {
  onClose: () => void;
  onSubmit: (data: T) => Promise<void>;
  fields: FieldConfig[];
  title: string;
}

const initializeFormData = <T extends GenericModel>(
  fields: FieldConfig[]
): T => {
  const initialData = {} as T;
  fields.forEach((field) => {
    if (field.type === 'date' && field.value) {
      const date = new Date(field.value);
      (initialData as any)[field.name] = date.toISOString().split('T')[0];
    } else if (field.type === 'number' && field.value === 0) {
      (initialData as any)[field.name] = 0;
    } else {
      (initialData as any)[field.name] = field.value || '';
    }
  });
  return initialData;
};

const GenericModal = <T extends GenericModel>({
  onClose,
  onSubmit,
  fields,
  title,
}: GenericModalProps<T>) => {
  const [formData, setFormData] = useState<T>(() =>
    initializeFormData<T>(fields)
  );
  const modalRef = useRef<HTMLDivElement | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    },
    []
  );

  const handleDynamicTableChange = useCallback((name: string, value: any[]) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSubmit(formData);
      onClose();
    },
    [formData, onSubmit, onClose]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  useEffect(() => {
    setFormData(initializeFormData(fields));
  }, [fields]);

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} ref={modalRef}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.modalTitle}>{title}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {fields.map((field) => (
            <label
              key={field.name}
              className={`${styles.label} ${
                field.type === 'dynamicTable' ? styles.fullWidth : ''
              }`}
            >
              {field.label}:
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className={styles.input}
                >
                  {field.options?.map((option, idx) => (
                    <option
                      key={idx}
                      value={typeof option === 'string' ? option : option.value}
                    >
                      {typeof option === 'string' ? option : option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === 'dynamicTable' ? (
                <DynamicTable
                  key={`${field.name}-${field.fields
                    ?.map((f) => f.name)
                    .join('-')}`} // Adicionando chave única para DynamicTable aninhado
                  fields={field.fields!}
                  buttonLabel={field.buttonLabel!}
                  name={field.name}
                  value={formData[field.name] || []}
                  onChange={handleDynamicTableChange}
                />
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  className={styles.input}
                  min={field.type === 'number' ? 0 : undefined}
                  step={field.type === 'number' ? 0.01 : undefined}
                />
              )}
            </label>
          ))}
          <div className={styles.buttonContainer}>
            <button type="submit" className={styles.submitButton}>
              {title.includes('Editar') ? 'Salvar' : 'Cadastrar'}
            </button>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenericModal;

import React, { useState, useEffect } from 'react';
import styles from './DynamicTable.module.scss';

interface FieldConfig {
  label: string;
  type: string;
  name: string;
  options?: { value: string; label: string }[];
  fields?: FieldConfig[];
  buttonLabel?: string;
}

interface DynamicTableProps {
  fields: FieldConfig[];
  buttonLabel: string;
  name: string;
  value: any[];
  onChange: (name: string, value: any[]) => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  fields,
  buttonLabel,
  name,
  value,
  onChange,
}) => {
  const [rows, setRows] = useState(value);

  useEffect(() => {
    setRows(value);
  }, [value]);

  const handleAddRow = () => {
    const newRow = fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'dynamicTable' ? [] : '';
      return acc;
    }, {} as any);
    const newRows = [...rows, newRow];
    setRows(newRows);
    onChange(name, newRows);
  };

  const handleRemoveRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onChange(name, newRows);
  };

  const handleChange = (index: number, fieldName: string, value: any) => {
    const newRows = rows.map((row, i) =>
      i === index ? { ...row, [fieldName]: value } : row
    );
    setRows(newRows);
    onChange(name, newRows);
  };

  return (
    <div className={styles.dynamicTable}>
      <table>
        <thead>
          <tr>
            {fields.map((field) => (
              <th key={field.name}>{field.label}</th>
            ))}
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`${name}-row-${rowIndex}`}>
              {fields.map((field) => (
                <td key={`${name}-${field.name}-${rowIndex}`}>
                  {field.type === 'select' ? (
                    <select
                      value={row[field.name]}
                      onChange={(e) =>
                        handleChange(rowIndex, field.name, e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Selecione
                      </option>
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'dynamicTable' ? (
                    <div className={styles.nestedTable}>
                      <DynamicTable
                        key={`${rowIndex}-${field.name}`} // Adicionando chave única para DynamicTable aninhado
                        fields={field.fields!}
                        buttonLabel={field.buttonLabel!}
                        name={field.name}
                        value={row[field.name]}
                        onChange={(name, value) =>
                          handleChange(rowIndex, name, value)
                        }
                      />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      value={row[field.name]}
                      onChange={(e) =>
                        handleChange(rowIndex, field.name, e.target.value)
                      }
                    />
                  )}
                </td>
              ))}
              <td key={`${name}-remove-${rowIndex}`}>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveRow(rowIndex)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className={styles.addButton} onClick={handleAddRow} type="button">
        {buttonLabel}
      </button>
    </div>
  );
};

export default DynamicTable;

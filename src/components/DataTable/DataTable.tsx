import React, { useState, useEffect, useRef } from 'react';
import styles from './DataTable.module.scss';

interface ActionButton<T> {
  label: string;
  onClick: (item: T) => void;
}

interface DataTableProps<T> {
  data: T[];
  columns: { header: string; accessor: keyof T }[];
  actionButtons?: ActionButton<T>[];
}

const DataTable = <T,>({ data, columns, actionButtons }: DataTableProps<T>) => {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const modalRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleActionClick = (rowIndex: number) => {
    setActiveRow(activeRow === rowIndex ? null : rowIndex);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      activeRow !== null &&
      modalRefs.current[activeRow] &&
      !modalRefs.current[activeRow]?.contains(event.target as Node)
    ) {
      setActiveRow(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeRow]);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <TableHeader columns={columns} hasActions={!!actionButtons?.length} />
        <tbody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              row={row}
              columns={columns}
              rowIndex={rowIndex}
              activeRow={activeRow}
              handleActionClick={handleActionClick}
              actionButtons={actionButtons}
              modalRef={(el) => (modalRefs.current[rowIndex] = el)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface TableHeaderProps<T> {
  columns: { header: string; accessor: keyof T }[];
  hasActions: boolean;
}

const TableHeader = <T,>({ columns, hasActions }: TableHeaderProps<T>) => (
  <thead>
    <tr>
      {columns.map((column) => (
        <th key={String(column.accessor)}>{column.header}</th>
      ))}
      {hasActions && <th className={styles.actionCell}>Ações</th>}
    </tr>
  </thead>
);

interface TableRowProps<T> {
  row: T;
  columns: { header: string; accessor: keyof T }[];
  rowIndex: number;
  activeRow: number | null;
  handleActionClick: (rowIndex: number) => void;
  actionButtons?: ActionButton<T>[];
  modalRef: (el: HTMLDivElement | null) => void;
}

const TableRow = <T,>({
  row,
  columns,
  rowIndex,
  activeRow,
  handleActionClick,
  actionButtons,
  modalRef,
}: TableRowProps<T>) => (
  <tr>
    {columns.map((column) => (
      <td key={String(column.accessor)}>{String(row[column.accessor])}</td>
    ))}
    {actionButtons && actionButtons.length > 0 && (
      <td className={styles.actionCell}>
        <button
          className={styles['action-button']}
          onClick={() => handleActionClick(rowIndex)}
        >
          &#x22EE;
        </button>
        {activeRow === rowIndex && (
          <ActionModal
            row={row}
            actionButtons={actionButtons}
            closeModal={() => handleActionClick(rowIndex)}
            modalRef={modalRef}
          />
        )}
      </td>
    )}
  </tr>
);

interface ActionModalProps<T> {
  row: T;
  actionButtons: ActionButton<T>[];
  closeModal: () => void;
  modalRef: (el: HTMLDivElement | null) => void;
}

const ActionModal = <T,>({
  row,
  actionButtons,
  closeModal,
  modalRef,
}: ActionModalProps<T>) => (
  <div className={styles['action-modal']} ref={modalRef}>
    {actionButtons.map((button, buttonIndex) => (
      <button
        key={buttonIndex}
        className={styles['modal-button']}
        onClick={() => {
          button.onClick(row);
          closeModal();
        }}
      >
        {button.label}
      </button>
    ))}
  </div>
);

export default DataTable;

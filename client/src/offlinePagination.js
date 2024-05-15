import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const OfflinePagination = ({ offlineAppointmentsPerPage, totalOfflineAppointments, currentPage, setCurrentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalOfflineAppointments / offlineAppointmentsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Pagination>
      {pageNumbers.map(number => (
        <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
          {number}
        </Pagination.Item>
      ))}
    </Pagination>
  );
};

export default OfflinePagination;

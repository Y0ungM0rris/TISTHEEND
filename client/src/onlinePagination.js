import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

const OnlinePagination = ({ onlineAppointmentsPerPage, totalOnlineAppointments, currentPage, setCurrentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalOnlineAppointments / onlineAppointmentsPerPage); i++) {
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

export default OnlinePagination;

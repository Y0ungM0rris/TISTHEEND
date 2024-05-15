import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import UpdateOfflineAppointmentStatus from './offlineStatusEdit'; 

function SplitBasicExample() {
  return (
    <Dropdown as="span" className="ml-2">
      <Dropdown.Toggle as="span" variant="success">
        Update Status
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item eventKey="1">
          <UpdateOfflineAppointmentStatus offline_id={1} />
        </Dropdown.Item>
        <Dropdown.Item eventKey="2">
          <UpdateOfflineAppointmentStatus offline_id={2} />
        </Dropdown.Item>
        {/* Add more Dropdown.Item components for each offline appointment */}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SplitBasicExample;

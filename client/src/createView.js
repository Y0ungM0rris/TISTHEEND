import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';


function DynamicComponentCreator() {
  const [viewId, setViewId] = useState('');
  const [componentName, setComponentName] = useState('');
  const [generatedFileName, setGeneratedFileName] = useState('');

  const handleViewIdChange = (e) => {
    setViewId(e.target.value);
  };

  const handleNameChange = (e) => {
    setComponentName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Generate component code
    const componentCode = `
      import React, { useState, useEffect } from 'react';
      import '../App.css';
      import { createRoot } from 'react-dom/client'; 
      import OffAppointmentsAdd from '../offlineAppointmentAdd';
      import OnAppointmentsAdd from '../onlineAppointmentAdd';
      import ViewInfo from '../viewInfo';
      import Slider from '../slider';
      import ViewPhoto from '../viewPhoto';
      import TitleAnimation from '../titleAnimation';
      import ExhibitsList from '../exhibitView';

      function ${componentName}() {
          const [userId, setUserId] = useState(null);
          const view_id = ${viewId}; 

          useEffect(() => {
              const token = localStorage.getItem('token');
              if (token) {
                  const decodedToken = decodeToken(token);
                  setUserId(decodedToken.userId);
              }
          }, []); 

          const decodeToken = (token) => {
              const tokenParts = token.split('.');
              const decodedPayload = JSON.parse(atob(tokenParts[1]));
              return decodedPayload;
          };

          return (
              <div className='ViewPage'>
                  <ViewPhoto viewId={view_id} />
                  <ExhibitsList viewId={view_id} />
                  <h5 style={{ textAlign: 'center' }}><TitleAnimation></TitleAnimation></h5>
                  <div className='ViewApp'>
                      {userId && <OffAppointmentsAdd userId={userId} view_id={view_id} />}
                      {userId && <OnAppointmentsAdd userId={userId} view_id={view_id}/>}
                  </div>
              </div>
          );
      }

      createRoot(document.getElementById('root')).render(<${componentName} />);

      export default ${componentName};
    `;

    // Create the file
    const blob = new Blob([componentCode], { type: 'text/javascript' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${componentName}.js`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setGeneratedFileName(`${componentName}.js`);
  };

  return (
    <div>
      <h2>Создать файл выставки</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="viewId">ID выставки</label>
        <input type="text" id="viewId" value={viewId} onChange={handleViewIdChange} required /><br /><br />
        <label htmlFor="componentName">Название файла</label>
        <input type="text" id="componentName" value={componentName} onChange={handleNameChange} required /><br /><br />
        <button type="submit">Создать файл</button>
      </form>
      <Table striped bordered hover style={{marginTop: '2vw', width: '45vw'}}>
        <tbody>
            <tr>
                <td>1</td>
                <td>После создания файла добавьте его в дирректорию ./src/pages </td>
            </tr>
            <tr>
                <td>2</td>
                <td>В компонент header добавьте соответствующий NavDropdown.Item</td>
            </tr>
            <tr>
                <td>3</td>
                <td>В компоненте index добавьте соответствующий Route</td>
            </tr>
            <tr>
                <td>4</td>
                <td>В админ панеле создайте соответствующую "Выставку"</td>
            </tr>
        </tbody>
      </Table>
      {generatedFileName && (
        <div>
          <h3>File Saved:</h3>
          <p>File "{generatedFileName}" saved to the root directory.</p>
        </div>
      )}
    </div>
  );
}

export default DynamicComponentCreator;

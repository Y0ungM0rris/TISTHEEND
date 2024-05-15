
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

      function ThreeViewPage() {
          const [userId, setUserId] = useState(null);
          const view_id = 3; 

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

      createRoot(document.getElementById('root')).render(<ThreeViewPage />);

      export default ThreeViewPage;
    
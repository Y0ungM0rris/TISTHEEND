import React from 'react';

function ErrorPage() {

  return (
    <div className='bobby'>
      <div className="error__container">
        <div className="error__code">
          <p>4</p>
          <p>0</p>
          <p>4</p>
        </div>
        <div className="error__title">Страница не найдена</div>
        <button className="action" >Go Home</button> {/* Добавление обработчика onClick */}
      </div>
    </div>
  );
}

export default ErrorPage;

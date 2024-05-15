import './titleAnimationStyles.css';

function UncontrolledExample() {
  // Получаем токен из локального хранилища
  const token = localStorage.getItem('token');

  return (
    <div>
        {token && <p className='TitleAnimation'>Не забудьте записаться на экскурсию</p>}
        {!token && <p className='TitleAnimation'>Авторизуйтесть, чтобы записаться на экскурсию</p>}
    </div>
  );
}

export default UncontrolledExample;

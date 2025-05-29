import './Field.scss';

const Field = ({state, setState}) => {
  console.log('***state', state);
  
  return (
    <div className="fieldContainer">
      <div className="endzone hero">
        {state?.score?.hero}
      </div>
      <div className="center"></div>
      <div className="endzone opponent">
        {state?.score?.opponent}
      </div>
    </div>
  );
}

export default Field;
import './Field.scss';

const Field = ({state, setState}) => {
  console.log('***state', state);
  
  return (
    <div className="fieldContainer">
      <div className="endzone">
        {state?.score?.hero}
      </div>
      <div className="center"></div>
      <div className="endzone">
        {state?.score?.opponent}
      </div>
    </div>
  );
}

export default Field;
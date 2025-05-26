import Field from '@components/Field';
import { useState } from 'react';
import './Stats.scss';

const Stats = () => {
  const [statsState, setStatsState] = useState({
    hero: 'DR',
    opponent: 'VAMPIRE',
    gameNum: 1,
    score: {
      hero: 0,
      opponent: 0,
    },
    timeouts: {
      hero: 0,
      opponent: 0,
    },
  });

  return (
    <div className="statsContainer">
      <div className="header">
        <h1>GAME #{statsState.gameNum}</h1>
        <div className='matchupContainer'>
          <h3 className='hero'>{statsState.hero}</h3>
          <h3>VS</h3>
          <h3 className='opponent'>{statsState.opponent}</h3>
        </div>
      </div>
      <Field
        state={statsState}
        setState={setStatsState}
      />
      <div className="buttons">Buttons</div>
      <div className="radialMenuContainer">Cool Radial Menu</div>
    </div>
  );
}

export default Stats;
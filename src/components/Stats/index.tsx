import Field from "#components/Field";
import RadialMenu from "#components/RadialMenu";
import { Stack } from "#utils";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import "./Stats.scss";

interface StatsState {
  hero: string;
  opponent: string;
  gameNum: number;
  score: Record<string, number>;
  timeouts: Record<string, number>;
  roster: Stack<Record<string, number>>;
}

const Stats = () => {
  const [statsState, setStatsState] = useState<StatsState>({
    hero: "DR",
    opponent: "VAMPIRE",
    gameNum: 1,
    score: {
      hero: 0,
      opponent: 0,
    },
    timeouts: {
      hero: 0,
      opponent: 0,
    },
    roster: [{ Gator: 0 }, { Whiteneck: 0 }, { Bonus: 0 }],
  });

  const TimeoutButton = styled(Button)({
    backgroundColor: "#F1F1F1",
  });

  return (
    <div className="statsContainer">
      <div className="header">
        <h1>GAME #{statsState.gameNum}</h1>
        <div className="matchupContainer">
          <h3 className="hero">{statsState.hero}</h3>
          <h3>VS</h3>
          <h3 className="opponent">{statsState.opponent}</h3>
        </div>
      </div>
      <Field state={statsState} setState={setStatsState} />
      <div
        style={{ width: "200px", maxHeight: "100px", border: "1px solid black", overflow: 'hidden', }}
      >
        {statsState.roster?.map((player: Record<string, number>, idx) => {
          const [[name, score]] = Object.entries(player);
          return (
            <div key={idx}>
              {name}: {score}
            </div>
          );
        })}
      </div>
      <div className="buttons">
        <TimeoutButton variant="outlined">
          Timeouts {statsState.timeouts.hero}
        </TimeoutButton>
        <TimeoutButton variant="outlined">
          Timeouts {statsState.timeouts.opponent}
        </TimeoutButton>
      </div>
      <RadialMenu state={statsState} setState={setStatsState} />
    </div>
  );
};

export default Stats;

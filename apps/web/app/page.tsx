"use client";

import { useState } from "react";

type GameType = "내전용" | "대회용";

const options: { type: GameType; tag: string; description: string; icon: "people" | "trophy" }[] = [
  { type: "내전용", tag: "CUSTOM MATCH", description: "친구, 팀원과 함께하는 내전을 위한 화면을 선택합니다.", icon: "people" },
  { type: "대회용", tag: "TOURNAMENT", description: "공식 경기와 토너먼트 진행을 위한 화면을 선택합니다.", icon: "trophy" },
];

function ChoiceIcon({ kind }: { kind: "people" | "trophy" }) {
  return kind === "people" ? (
    <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="11" cy="11" r="4"/><circle cx="23" cy="12" r="3"/><path d="M3.5 26c.4-5.3 3-8 7.5-8s7.1 2.7 7.5 8H3.5ZM19 20c4.7-.9 8.7 1.3 9.5 6H22"/></svg>
  ) : (
    <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 5h14v9a7 7 0 0 1-14 0V5ZM9 8H4v4a5 5 0 0 0 5 5m14-9h5v4a5 5 0 0 1-5 5M16 21v5m-6 2h12"/></svg>
  );
}

export default function Home() {
  const [selected, setSelected] = useState<GameType | null>(null);

  return (
    <div className="shell">
      <header>
        <div className="brand"><span className="brand-mark" aria-hidden="true">◆</span><span>LCK UI</span></div>
        <div className="header-note">GAME SETUP / 01</div>
      </header>

      <main>
        <div className="eyebrow">SELECT GAME TYPE</div>
        <h1>어떤 게임을 준비하시나요?</h1>
        <p className="intro">진행하려는 게임의 유형을 선택해 주세요.</p>

        <div className="choices" role="group" aria-label="게임 유형 선택">
          {options.map((option) => (
            <button
              key={option.type}
              className={`choice${option.icon === "trophy" ? " tournament" : ""}`}
              type="button"
              aria-pressed={selected === option.type}
              onClick={() => setSelected(option.type)}
            >
              <span className="card-top">
                <span className="icon" aria-hidden="true"><ChoiceIcon kind={option.icon} /></span>
                <span className="check" aria-hidden="true">✓</span>
              </span>
              <span className="tag">{option.tag}</span>
              <span className="title">{option.type}</span>
              <span className="description">{option.description}</span>
              <span className="select-label">{option.type} 선택 <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>

        <div className="footer-row">
          <p className="selected-text" aria-live="polite">
            {selected ? <>선택한 유형: <strong>{selected}</strong></> : "게임 유형을 선택해 주세요."}
          </p>
          <button className="continue" type="button" disabled={!selected}>계속하기 &nbsp;→</button>
        </div>
        <div className="footnote">LCK UI · GAME TYPE SELECTION</div>
      </main>
    </div>
  );
}

import { activityLabels, stations, type Destination } from "./world/stations";
import type { Activity } from "./world/routine";
const icons = {
  coffee:
    "M5 9h12v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9Z M17 10h2a3 3 0 0 1 0 6h-2 M8 6V3 M12 6V2",
  code: "M3 4h18v12H3z M8 21h8 M12 16v5 M9 8l-3 2 3 2 M15 8l3 2-3 2",
  read: "M12 5v15 M12 5Q7 2 3 5v14q5-3 9 1 4-4 9-1V5q-5-3-9 0",
  sleep: "M4 16h16v4 M4 20V9 M4 14h16v6 M14 3h5l-5 5h5",
  move: "M8 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0 M11 9l4 4 5-1 M11 9l-3 5-5 1 M11 11l2 6 5 4 M10 15l-4 6",
  pet: "M8 13q4-4 8 0l3 5q-1 4-7 1-6 3-7-1z M4 7a1 2 0 1 0 0 .1 M9 4a1 2 0 1 0 0 .1 M15 4a1 2 0 1 0 0 .1 M20 7a1 2 0 1 0 0 .1",
  exercise: "M7 12h10 M3 8h4v8H3z M17 8h4v8h-4z M1 10v4 M23 10v4",
  eat: "M3 13h18q-1 8-9 8t-9-8 M7 3v6 M12 2v7 M17 3v6",
};
export function ActivityCard({
  activity,
  paused,
  en,
  destination,
  discovered,
  onResume,
}: {
  activity: Activity;
  paused: boolean;
  en: boolean;
  destination: Destination | null;
  discovered: number;
  onResume: () => void;
}) {
  const station = stations.find((s) => s.id === destination);
  const icon =
    activity === "code" || activity === "sit"
      ? "code"
      : activity === "read"
        ? "read"
        : activity === "sleep" || activity === "recline"
          ? "sleep"
          : activity === "pet"
            ? "pet"
            : activity === "exercise"
              ? "exercise"
              : activity === "eat"
                ? "eat"
                : ["coffee", "reach", "return-cup"].includes(activity)
                  ? "coffee"
                  : "move";
  return (
    <div
      className="activity-card"
      aria-label={en ? "Guh’s current activity" : "O que o Guh está fazendo"}
    >
      <span className="activity-icon">
        <svg
          width="23"
          height="23"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={icons[icon]} />
        </svg>
      </span>
      <div className="activity-copy" aria-live="polite" aria-atomic="true">
        <strong>
          {paused
            ? en
              ? "A little pause"
              : "Uma pequena pausa"
            : activityLabels[activity][en ? 1 : 0]}
        </strong>
        <p>
          {station
            ? activity === "walk"
              ? (en ? "On my way: " : "A caminho: ") +
                station.label[en ? 1 : 0].toLowerCase()
              : station.hint[en ? 1 : 0]
            : en
              ? "Exploring at my own pace."
              : "Explorando no meu próprio ritmo."}
        </p>
      </div>
      <span className="live-dot">
        {paused
          ? en
            ? "PAUSED"
            : "PAUSA"
          : destination
            ? en
              ? "WITH YOU"
              : "COM VOCÊ"
            : "LIVE"}
      </span>
      <div
        className="discovery-track"
        aria-label={`${discovered} / ${stations.length} ${en ? "places explored" : "cantos explorados"}`}
      >
        <span style={{ width: `${(discovered / stations.length) * 100}%` }} />
      </div>
      <span className="discovery-count" aria-hidden="true">
        {discovered} / {stations.length}
      </span>
      {destination && (
        <button
          className="resume-routine"
          onClick={onResume}
          aria-label={en ? "Resume free routine" : "Retomar rotina livre"}
          title={en ? "Resume free routine" : "Retomar rotina livre"}
        >
          ↻
        </button>
      )}
    </div>
  );
}

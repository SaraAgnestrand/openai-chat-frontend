import * as s from "../app.css";

export default function Settings() {
  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Inställningar</h2>
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        Modell/temperatur/personlighet och tema (implementeras senare).
      </div>
    </div>
  );
}

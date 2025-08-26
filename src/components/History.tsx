import * as s from "../app.css";

export default function History() {
  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Historik</h2>
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        Här kommer dina sparade konversationer (implementeras senare).
      </div>
    </div>
  );
}

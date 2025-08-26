import * as s from "../app.css";
export function Home() {
  return (
    <div style={{ width: "100%" }}>
      <h2 className={s.header}>Välkommen</h2>
      <div className={s.msgBot} style={{ maxWidth: "100%" }}>
        Detta är startsidan. Gå till Chat för att börja prata.
      </div>
    </div>
  );
}

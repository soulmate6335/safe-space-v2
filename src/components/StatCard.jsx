function StatCard({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        padding: 20,
        background: "#fff",
        borderRadius: 15,
        textAlign: "center",
        boxShadow: "0 5px 15px rgba(0,0,0,.05)",
      }}
    >
      <h3>{value}</h3>

      <small>{title}</small>
    </div>
  );
}

export default StatCard;
import img from "./error.gif";

const ErrorMessage = () => {
  return (
    <div>
      <img
        style={{
          display: "block",
          width: "250px",
          height: "250px",
          objectFit: "contain",
          margin: "0 auto",
        }}
        src={img}
        alt="Oopss... Error"
      />
      <p
        style={{
          display: "table",
          margin: "0 auto",
          paddingBottom: "15px",
          fontSize: "20px",
          fontWeight: 'bold'
        }}
      >
        Error..
      </p>
    </div>
  );
};

export { ErrorMessage };

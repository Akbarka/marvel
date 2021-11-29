import loader from "../../resources/img/loader.gif";

const Spinner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', marginTop: '40px'}}>
      <img src={loader} alt="Loading.."></img>
    </div>
  );
};

export { Spinner };

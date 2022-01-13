import { ErrorMessage } from "../errorMessage/ErrorMessage";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <div>
      <ErrorMessage />
      <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "24px" }}>
        Page doesnt't exist
      </p>
      <Link
        to="/marvel"
        style={{
          display: "block",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "24px",
          marginTop: "30px",
          color: '#9F0013'
        }}
      >
        Back to main page
      </Link>
    </div>
  );
};

export default Page404;

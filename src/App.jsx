import { BrowserRouter } from "react-router-dom";
import AppRoutes from  "./route/AppRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
   <>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover theme="colored"/>
    </>
  );
}

export default App;
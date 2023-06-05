import Dashboard from "./pages/Dashboard";
import { Routes, Route } from "react-router-dom";
import { Signin } from "./pages/Signin";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Signup } from "./pages/Signup";

function App() {
  return (
    <div className='container-xxl py-2'>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />} />
        </Route>
        <Route path='signin' element={<Signin />} />
        <Route path='signup' element={<Signup />} />
        <Route
          path='*'
          element={<h3>Page you are looking not found: 404!</h3>}
        />
      </Routes>
    </div>
  );
}

export default App;

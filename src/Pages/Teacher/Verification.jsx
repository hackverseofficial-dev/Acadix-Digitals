import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// ... other imports
import Verification from "./Pages/Teacher/Verification"; // Import this

function App() {
  return (
    <Router>
      <Routes>
        {/* ... existing routes ... */}
        
        {/* Add Verification Route */}
        <Route path="/faculty/verify" element={<Verification />} />
        
      </Routes>
    </Router>
  );
}

export default App;


import { Navigate } from "react-router-dom";

const Index = () => {
  // This is just a placeholder page that redirects to the login page
  // Once you connect with Supabase, this will be replaced with actual authentication state
  return <Navigate to="/login" />;
};

export default Index;

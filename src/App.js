import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import UserContextProvider from "./contexts/UserContext";
import { QueryClient, QueryClientProvider } from "react-query";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import AlbumPage from "./pages/AlbumPage";
import CustomerView from "./pages/CustomerView";
import AfterReview from "./pages/AfterReview";
import PageNotFound from "./pages/PageNotFound";
import Navigation from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "bootstrap/dist/css/bootstrap.min.css";
import SimpleReactLightbox from "simple-react-lightbox";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 minutes
      cacheTime: 1000 * 60 * 60 * 4, // 4 hours
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <BrowserRouter>
            <Navigation />
            <SimpleReactLightbox>
              <div className="pageWrapper">
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/review/:id" element={<CustomerView />} />
                  <Route path="/review/thank-you" element={<AfterReview />} />
                  <Route path="*" element={<PageNotFound />} />

                  {/* Protected routes */}
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute redirectTo="/login">
                        <HomePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/album/:id"
                    element={
                      <ProtectedRoute redirectTo="/login">
                        <AlbumPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </SimpleReactLightbox>
          </BrowserRouter>
        </UserContextProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;

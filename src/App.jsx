import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import BookingHistory from './pages/BookingHistory';
import Search from './pages/Search';
import AuthCallback from './components/AuthCallback';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="movie/:id" element={<MovieDetails />} />
            <Route path="history" element={<BookingHistory />} />
            <Route path="search" element={<Search />} />
            <Route path="/auth-callback" element={<AuthCallback />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
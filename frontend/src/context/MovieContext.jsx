import { createContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const MovieContext = createContext(null);

const MovieContextProvider = (props) => {
  const url = process.env.REACT_APP_API_URL || "https://movie-website-backend-ojad.onrender.com";
  
  // Auth State
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Movie State
  const [movies, setMovies] = useState([]);
  const [moviesPagination, setMoviesPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 0
  });
  
  // User State
  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  
  // Loading State
  const [loading, setLoading] = useState(false);

  // MOVIE FUNCTIONS
  
  const fetchMovies = useCallback(async (page = 1, limit = 8) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/movies/list`, {
        params: { page, limit }
      });
      
      if (response.data.success) {
        setMovies(response.data.data);
        setMoviesPagination(response.data.pagination);
        return response.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch movies");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const searchMovies = useCallback(async (query, page = 1, limit = 8) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/movies/search`, {
        params: { query, page, limit }
      });
      
      if (response.data.success) {
        setMovies(response.data.data);
        setMoviesPagination(response.data.pagination);
        return response.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const getSortedMovies = useCallback(async (sortBy, order = 'desc', page = 1, limit = 8) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/movies/sorted`, {
        params: { sortBy, order, page, limit }
      });
      
      if (response.data.success) {
        setMovies(response.data.data);
        setMoviesPagination(response.data.pagination);
        return response.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to sort movies");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const getMovieById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/movies/${id}`);
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch movie details");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const addMovie = useCallback(async (formData) => {
    try {
      const response = await axios.post(`${url}/api/movies/add`, formData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("Movie added successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add movie");
      return false;
    }
  }, [url, token]);

  const updateMovie = useCallback(async (id, formData) => {
    try {
      const response = await axios.put(`${url}/api/movies/${id}`, formData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("Movie updated successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update movie");
      return false;
    }
  }, [url, token]);

  const deleteMovie = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${url}/api/movies/${id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("Movie deleted successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete movie");
      return false;
    }
  }, [url, token]);

  // USER MANAGEMENT FUNCTIONS

  const getAllUsers = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/user/list`, {
        params: { page, limit },
        headers: { token }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        setUsersPagination(response.data.pagination);
        return response.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  const searchUsers = useCallback(async (query, page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/user/search`, {
        params: { query, page, limit },
        headers: { token }
      });
      
      if (response.data.success) {
        setUsers(response.data.data);
        setUsersPagination(response.data.pagination);
        return response.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  const getUserById = useCallback(async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/user/${id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        return response.data.data;
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  }, [url, token]);

  const addUser = useCallback(async (userData) => {
    try {
      const response = await axios.post(`${url}/api/user/add`, userData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("User added successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add user");
      return false;
    }
  }, [url, token]);

  const updateUser = useCallback(async (id, userData) => {
    try {
      const response = await axios.put(`${url}/api/user/${id}`, userData, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("User updated successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update user");
      return false;
    }
  }, [url, token]);

  const deleteUser = useCallback(async (id) => {
    try {
      const response = await axios.delete(`${url}/api/user/${id}`, {
        headers: { token }
      });
      
      if (response.data.success) {
        toast.success("User deleted successfully!");
        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete user");
      return false;
    }
  }, [url, token]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (storedToken) {
        setToken(storedToken);
      }
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      setAuthLoading(false);
    };
    
    loadData();
  }, []);

  const contextValue = {
    url,
    token,
    setToken,
    user,
    setUser,
    authLoading,
    movies,
    setMovies,
    moviesPagination,
    users,
    setUsers,
    usersPagination,
    loading,
    // Movie functions
    fetchMovies,
    searchMovies,
    getSortedMovies,
    getMovieById,
    addMovie,
    updateMovie,
    deleteMovie,
    // User functions
    getAllUsers,
    searchUsers,
    getUserById,
    addUser,
    updateUser,
    deleteUser
  };

  return (
    <MovieContext.Provider value={contextValue}>
      {props.children}
    </MovieContext.Provider>
  );
};

export default MovieContextProvider;

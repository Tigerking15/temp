// src/api.js
import axios from "axios";

/**
 * IMPORTANT:
 * - Backend response shapes should be consistent; this client normalizes errors.
 */

/* ---------------------------
   Base URLs
   --------------------------- */
const API_HOST = process.env.API_HOST || "http://localhost:5000";
const USER_BASE = `${API_HOST}/api/users`;
const QUIZ_BASE = `${API_HOST}/api/quiz`;
const RECIPE_BASE = `${API_HOST}/api/recipes`;
const DOCTOR_BASE = `${API_HOST}/api/doctors`;
const PLANT_BASE = `${API_HOST}/api/plants`;

// Helper to construct image URL
export const getImageUrl = (filename) => {
  if (!filename) return "https://randomuser.me/api/portraits/lego/1.jpg"; // default image
  if (filename.startsWith("http")) return filename;
  return `${API_HOST}/uploads/${filename}?t=${Date.now()}`;
};

/* ---------------------------
   Helper: Auth header
   --------------------------- */
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const getDoctorAuthHeader = () => {
  const token = localStorage.getItem("doctorToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/* ---------------------------
   Helper: normalize axios responses (internal)
   --------------------------- */
const _handleError = (error) => {
  // Prefer backend message if present
  const message =
    error?.response?.data?.message ||
    error?.response?.data ||
    error?.message ||
    "Unknown error";
  return { success: false, message, error: error?.response?.data || error?.message || error };
};

/* ---------------------------
   AUTH / USER ENDPOINTS
   --------------------------- */

/**
 * Register a new user
 * userData: FormData with { name, email, password, age?, gender?, profileImage? }
 * Expected backend response: { success: true, token, user }
 */
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${USER_BASE}/register`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${USER_BASE}/login`, { email, password });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getMyProfile = async () => {
  try {
    const headers = getAuthHeader();
    const res = await axios.get(`${USER_BASE}/me`, { headers });
    if (res.data && res.data._id) return { success: true, user: res.data };
    return { success: true, user: res.data.user || res.data };
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Update profile for logged-in user
 * updateData: FormData with { name?, age?, gender?, doshaType?, profileImage? }
 * Returns: { success: true, user } or { success: false, message }
 */
export const updateUserProfile = async (updateData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.put(`${USER_BASE}/update`, updateData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/* ---------------------------
   QUIZ ENDPOINTS
   --------------------------- */

export const submitDoshaQuiz = async (formData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.post(`${QUIZ_BASE}/submit`, { answers: formData }, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getMyQuizzes = async () => {
  try {
    const headers = getAuthHeader();
    const res = await axios.get(`${QUIZ_BASE}/my`, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/* ---------------------------
   RECIPE ENDPOINTS
   --------------------------- */

export const addUserRecipe = async (recipeData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.post(`${RECIPE_BASE}`, recipeData, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getUserRecipes = async () => {
  try {
    const headers = getAuthHeader();
    const res = await axios.get(`${RECIPE_BASE}`, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const updateUserRecipe = async (recipeId, updateData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.put(`${RECIPE_BASE}/${recipeId}`, updateData, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const deleteUserRecipe = async (recipeId) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.delete(`${RECIPE_BASE}/${recipeId}`, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getPublicRecipes = async () => {
  try {
    const res = await axios.get(`${RECIPE_BASE}/public`);
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/* ---------------------------
   DOCTOR ENDPOINTS
   --------------------------- */

export const registerDoctor = async (doctorData) => {
  try {
    const res = await axios.post(`${DOCTOR_BASE}/register`, doctorData);
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const loginDoctor = async (email, password) => {
  try {
    const res = await axios.post(`${DOCTOR_BASE}/login`, { email, password });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getMyDoctorProfile = async () => {
  try {
    const headers = getDoctorAuthHeader();
    const res = await axios.get(`${DOCTOR_BASE}/me`, { headers });
    if (res.data && res.data._id) return { success: true, doctor: res.data };
    return { success: true, doctor: res.data.doctor || res.data };
  } catch (err) {
    return _handleError(err);
  }
};

export const updateDoctorProfile = async (updateData) => {
  try {
    const headers = getDoctorAuthHeader();
    const res = await axios.put(`${DOCTOR_BASE}/update`, updateData, { headers });
    if (res.data && res.data._id) return { success: true, doctor: res.data };
    return { success: true, doctor: res.data.doctor || res.data };
  } catch (err) {
    return _handleError(err);
  }
};

export const getAllDoctors = async () => {
  try {
    const res = await axios.get(`${DOCTOR_BASE}/all`);
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const bookConsultation = async (consultationData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.post(`${API_HOST}/api/consultation/book`, consultationData, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

export const getDoctorConsultations = async () => {
  try {
    const headers = getDoctorAuthHeader();
    const res = await axios.get(`${API_HOST}/api/consultation/doctor`, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Update consultation status (Accept/Cancel)
 * consultationId: string, status: "Accepted" or "Cancelled"
 * Returns: { success: true, consultation } or { success: false, message }
 */
export const updateConsultationStatus = async (consultationId, status) => {
  try {
    const headers = getDoctorAuthHeader();
    const res = await axios.put(`${API_HOST}/api/consultation/${consultationId}/status`, { status }, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/* ---------------------------
   PLANT ENDPOINTS (NEW)
   --------------------------- */

/**
 * Get all plants
 * Query params:
 *   minimal=true -> returns only slug & displayName (backend must support or filter on client)
 * Returns backend response directly.
 */
export const getAllPlants = async (opts = { minimal: false }) => {
  try {
    const url = opts.minimal ? `${PLANT_BASE}?minimal=true` : PLANT_BASE;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Get a single plant by slug
 */
export const getPlantBySlug = async (slug) => {
  try {
    const res = await axios.get(`${PLANT_BASE}/${slug}`);
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Create a new plant (protected - requires auth token in localStorage 'token')
 * plantData example:
 * {
 *   slug: "neem",
 *   displayName: "Neem",
 *   modelPath: "/models/plants/neem-compressed.glb",
 *   parts: { Leaves: { partUsed: "Leaves", commonName: "...", ... } }
 * }
 */
export const createPlant = async (plantData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.post(`${PLANT_BASE}`, plantData, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Bulk create/upsert plants
 * payload: array of plant objects
 * query: ?overwrite=true to upsert (backend must support)
 */
export const createManyPlants = async (plantsArray, opts = { overwrite: true }) => {
  try {
    const overwriteFlag = opts.overwrite ? "?overwrite=true" : "";
    const headers = getAuthHeader();
    const res = await axios.post(`${PLANT_BASE}/bulk${overwriteFlag}`, plantsArray, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Update plant (by slug) - protected
 */
export const updatePlant = async (slug, updateData) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.put(`${PLANT_BASE}/${slug}`, updateData, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/**
 * Delete plant (by slug) - protected
 */
export const deletePlant = async (slug) => {
  try {
    const headers = getAuthHeader();
    const res = await axios.delete(`${PLANT_BASE}/${slug}`, { headers });
    return res.data;
  } catch (err) {
    return _handleError(err);
  }
};

/* ---------------------------
   Helper: fetch local JSON (optional)
   --------------------------- */

export const fetchLocalRecipes = async (publicPath = "/data/recipeupdated.json") => {
  try {
    const res = await fetch(publicPath);
    if (!res.ok) throw new Error(`Failed to fetch ${publicPath}: ${res.statusText}`);
    const json = await res.json();
    return { success: true, recipes: json };
  } catch (err) {
    return { success: false, message: err.message || err };
  }
};

/* ---------------------------
   Exports (default)
   --------------------------- */
export default {
  registerUser,
  loginUser,
  getMyProfile,
  submitDoshaQuiz,
  getMyQuizzes,
  addUserRecipe,
  getUserRecipes,
  updateUserRecipe,
  deleteUserRecipe,
  getPublicRecipes,
  fetchLocalRecipes,
  registerDoctor,
  loginDoctor,
  getMyDoctorProfile,
  updateDoctorProfile,
  getAllDoctors,
  bookConsultation,
  getDoctorConsultations,

  // Plants
  getAllPlants,
  getPlantBySlug,
  createPlant,
  createManyPlants,
  updatePlant,
  deletePlant,

  // helpers
  getImageUrl,
};

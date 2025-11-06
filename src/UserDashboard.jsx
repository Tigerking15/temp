// src/UserDashboard.jsx
import { getMyProfile, updateUserProfile, addUserRecipe, getUserRecipes, updateUserRecipe, deleteUserRecipe, getImageUrl } from "./api";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Flame,
  Sparkles,
  Utensils,
  PlusCircle,
  Trophy,
  Heart,
  Sun,
  CloudRain,
  Snowflake,
  BookOpen,
  Camera,
  User,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import AyurvedaNews from "./AyurvedaNews";

const Card = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white border border-gray-100 rounded-2xl shadow-sm p-6 ${className}`}
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
  >
    {children}
  </motion.div>
);

const SectionTitle = ({ icon: Icon, title, accent = "" }) => (
  <div className="flex items-center gap-2 mb-4">
    {Icon && <Icon className={`h-5 w-5 ${accent}`} />}
    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
  </div>
);

const seasonalRecipes = {
  Summer: [
    { title: "Cooling Cucumber Raita", desc: "Light, pitta-calming accompaniment." },
    { title: "Aloe Vera Juice", desc: "Helps soothe excess heat." },
  ],
  Monsoon: [
    { title: "Ginger Tulsi Tea", desc: "Supports immunity in damp weather." },
    { title: "Warm Kitchari", desc: "Simple, digestible, balancing." },
  ],
  Winter: [
    { title: "Golden Milk", desc: "Warming and restorative." },
    { title: "Sweet Potato Curry", desc: "Grounding, nourishing spices." },
  ],
};

// Full pool of challenges (expanded)
const FULL_CHALLENGES_POOL = [
  "Drink a glass of turmeric water",
  "Do 10 minutes of meditation",
  "Log today’s symptoms",
  "Cook one Ayurvedic recipe",
  "Walk for 20 minutes",
  "Do 5 minutes of deep breathing (pranayama)",
  "Apply a warm oil massage (self-abhyanga) for 5 minutes",
  "Eat a warm, cooked meal (no raw salads)",
  "Limit screen time 1 hour before bed",
  "Sip warm ginger water after meals",
];

const VISIBLE_CHALLENGE_COUNT = 4;

const DOSHAS = ["Vata", "Pitta", "Kapha", "Tridoshic"];

export default function UserDashboard() {
  // ---- Profile (left pane) ----
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved
      ? JSON.parse(saved)
      : {
          name: "Guest User",
          email: "",
          age: "",
          gender: "",
          dosha: "Vata",
          photoDataUrl: "",
          _id: "",
        };
  });

  // ---- Wellness + journaling (right pane) ----
  const [progress, setProgress] = useState(() => {
    const v = localStorage.getItem("progress");
    return v ? Number(v) : 65;
  });

  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("streak")) || 0);
  const [lastLogDate, setLastLogDate] = useState(localStorage.getItem("lastLogDate") || null);
  const [completedChallenges, setCompletedChallenges] = useState(() => {
    const saved = localStorage.getItem("swasthya_completedChallenges");
    return saved ? JSON.parse(saved) : [];
  });

  // visibleChallenges is computed from FULL_CHALLENGES_POOL and completedChallenges,
  // but we keep it in state so UI updates are straightforward.
  const [visibleChallenges, setVisibleChallenges] = useState(() => {
    // pick first VISIBLE_CHALLENGE_COUNT that are not completed
    const savedVisible = localStorage.getItem("swasthya_visibleChallenges");
    if (savedVisible) {
      try {
        return JSON.parse(savedVisible);
      } catch {
        // fallthrough to compute below
      }
    }
    return FULL_CHALLENGES_POOL.filter((c) => !(completedChallenges.includes(c))).slice(0, VISIBLE_CHALLENGE_COUNT);
  });

  const [userRecipes, setUserRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(false);

  const [newRecipe, setNewRecipe] = useState({ title: "", description: "", ingredients: "", steps: "", doshaType: "Vata", isPublic: false });
  const [addingRecipe, setAddingRecipe] = useState(false);
  const [symptomLog, setSymptomLog] = useState("");
  const [allLogs, setAllLogs] = useState(() => {
    const saved = localStorage.getItem("symptomLogs");
    return saved ? JSON.parse(saved) : [];
  });

  // ---- Utilities for date handling ----
  const todayStr = () => new Date().toDateString();
  const RESET_DATE_KEY = "swasthya_challengesResetDate";

  // ---- Persist certain states to localStorage ----
  useEffect(() => {
    try {
      localStorage.setItem("userProfile", JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not persist userProfile:", e);
    }
  }, [profile]);

  useEffect(() => localStorage.setItem("symptomLogs", JSON.stringify(allLogs)), [allLogs]);
  useEffect(() => localStorage.setItem("swasthya_completedChallenges", JSON.stringify(completedChallenges)), [completedChallenges]);
  useEffect(() => localStorage.setItem("swasthya_visibleChallenges", JSON.stringify(visibleChallenges)), [visibleChallenges]);
  useEffect(() => localStorage.setItem("progress", String(progress)), [progress]);

  // ---- Load user recipes from backend ----
  useEffect(() => {
    const loadUserRecipes = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingRecipes(true);
      try {
        const res = await getUserRecipes();
        if (res.success) {
          setUserRecipes(res.recipes);
        }
      } catch (error) {
        console.error("Failed to load user recipes:", error);
      } finally {
        setLoadingRecipes(false);
      }
    };

    loadUserRecipes();
  }, []);

  // ---- Season ----
  const season = useMemo(() => {
    const month = new Date().getMonth() + 1;
    if ([3, 4, 5].includes(month)) return "Summer";
    if ([6, 7, 8, 9].includes(month)) return "Monsoon";
    return "Winter";
  }, []);

  // ---- Fetch profile from backend and keep in sync ----
  // ...existing code...
// ...existing code...

useEffect(() => {
  let mounted = true;

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      const guest = { name: "Guest User", email: "", age: "", gender: "", dosha: "Vata", photoDataUrl: "", _id: "" };
      if (mounted) setProfile(guest);
      try { localStorage.removeItem("userProfile"); } catch (_) {}
      return;
    }

    try {
      const res = await getMyProfile();

      if (!mounted) return;

      // normalize result -> find user object
      const user = res && res.success && res.user ? res.user : (res && res._id ? res : null);

      if (user && user._id) {
        // pick possible image fields and normalize to a full URL
        const candidate =
          user.photoDataUrl ||
          user.profileImage ||
          user.profileImageUrl ||
          user.image ||
          user.avatar ||
          "";

        const photoDataUrl =
          candidate && (candidate.startsWith?.("http") || candidate.startsWith?.("data:"))
            ? candidate
            : candidate
            ? getImageUrl(candidate)
            : profile.photoDataUrl || "";

        const userObj = {
          name: user.name || user.fullName || (profile.name !== "Guest User" ? profile.name : ""),
          email: user.email || "",
          age: user.age || "",
          gender: user.gender || "",
          dosha: user.doshaType || user.dosha || profile.dosha || "Unknown",
          photoDataUrl,
          _id: user._id || "",
        };

        setProfile(userObj);
        try {
          localStorage.setItem("userProfile", JSON.stringify(userObj));
          localStorage.setItem("userName", userObj.name || "");
        } catch (e) {}
      } else {
        const saved = localStorage.getItem("userProfile");
        if (saved && mounted) setProfile(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      const saved = localStorage.getItem("userProfile");
      if (saved && mounted) setProfile(JSON.parse(saved));
    }
  };

  loadProfile();
  const onUserChanged = () => loadProfile();
  window.addEventListener("userChanged", onUserChanged);
  return () => {
    mounted = false;
    window.removeEventListener("userChanged", onUserChanged);
  };
}, []);
// ...existing code...

  // ---- Challenge: Reset daily and compute visible challenges ----
  useEffect(() => {
    const storedReset = localStorage.getItem(RESET_DATE_KEY);
    const today = todayStr();

    const computeVisible = (completed) => {
      return FULL_CHALLENGES_POOL.filter((c) => !completed.includes(c)).slice(0, VISIBLE_CHALLENGE_COUNT);
    };

    if (storedReset !== today) {
      // New day -> reset completed challenges
      setCompletedChallenges([]);
      const initialVisible = computeVisible([]);
      setVisibleChallenges(initialVisible);
      localStorage.setItem(RESET_DATE_KEY, today);
      localStorage.setItem("swasthya_completedChallenges", JSON.stringify([]));
      localStorage.setItem("swasthya_visibleChallenges", JSON.stringify(initialVisible));
    } else {
      // same day -> ensure visible is consistent with completedChallenges
      setVisibleChallenges((prev) => {
        // compute fresh visible based on any stored completedChallenges
        try {
          const savedCompleted = JSON.parse(localStorage.getItem("swasthya_completedChallenges") || "[]");
          const fresh = computeVisible(savedCompleted);
          return fresh;
        } catch {
          return prev;
        }
      });
    }

    // Also set interval to detect date change while app is open (checks every minute)
    const interval = setInterval(() => {
      const nowDate = todayStr();
      const lastStored = localStorage.getItem(RESET_DATE_KEY);
      if (lastStored !== nowDate) {
        // force reset now
        setCompletedChallenges([]);
        const initialVisible = computeVisible([]);
        setVisibleChallenges(initialVisible);
        localStorage.setItem(RESET_DATE_KEY, nowDate);
        localStorage.setItem("swasthya_completedChallenges", JSON.stringify([]));
        localStorage.setItem("swasthya_visibleChallenges", JSON.stringify(initialVisible));
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ---- Handlers ----
  const toggleChallenge = (challenge) => {
    setCompletedChallenges((prevCompleted) => {
      const isCompleted = prevCompleted.includes(challenge);
      let nextCompleted;
      if (isCompleted) {
        // uncheck -> remove from completed
        nextCompleted = prevCompleted.filter((c) => c !== challenge);
      } else {
        // check -> add to completed
        nextCompleted = [...prevCompleted, challenge];
      }

      // compute new visible based on the updated completed set
      const nextVisible = FULL_CHALLENGES_POOL.filter((c) => !nextCompleted.includes(c)).slice(0, VISIBLE_CHALLENGE_COUNT);

      setVisibleChallenges(nextVisible);

      // persist
      localStorage.setItem("swasthya_completedChallenges", JSON.stringify(nextCompleted));
      localStorage.setItem("swasthya_visibleChallenges", JSON.stringify(nextVisible));

      return nextCompleted;
    });
  };

  const addRecipe = async () => {
    if (!newRecipe.title.trim()) return;
    setAddingRecipe(true);
    try {
      const res = await addUserRecipe(newRecipe);
      if (res.success) {
        setUserRecipes((prev) => [...prev, res.recipe]);
        setNewRecipe({ title: "", description: "", ingredients: "", steps: "", doshaType: "Vata", isPublic: false });
      } else {
        alert("Failed to add recipe: " + res.message);
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Error adding recipe");
    } finally {
      setAddingRecipe(false);
    }
  };

  const logSymptoms = () => {
    if (!symptomLog.trim()) return;
    const today = new Date().toDateString();

    if (lastLogDate !== today) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("streak", String(newStreak));
      setLastLogDate(today);
      localStorage.setItem("lastLogDate", today);
    }

    const updatedLogs = [{ date: today, text: symptomLog }, ...allLogs].slice(0, 50);
    setAllLogs(updatedLogs);
    setSymptomLog("");
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create FormData for upload
    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      const res = await updateUserProfile(formData);
      if (res.success) {
        // Update profile with new image URL from backend
        setProfile((p) => ({
          ...p,
          photoDataUrl: res.user.profileImage || p.photoDataUrl,
        }));
        // Trigger profile reload to sync with backend
        window.dispatchEvent(new Event('userChanged'));
      } else {
        alert("Failed to update profile image: " + res.message);
      }
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Error uploading profile image");
    }
  };

  const SeasonIcon = () =>
    season === "Summer" ? (
      <Sun className="w-5 h-5 text-amber-500" />
    ) : season === "Monsoon" ? (
      <CloudRain className="w-5 h-5 text-sky-500" />
    ) : (
      <Snowflake className="w-5 h-5 text-blue-600" />
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between max-w-full mx-auto">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                  <Heart className="w-8 h-8 text-primary" />
                  Wellness Dashboard
                </h1>
                <p className="text-gray-600 mt-1">Personalized insights for your {profile.dosha} profile.</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main grid */}
      <main className="px-6 pb-24">
        <div className="max-w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Profile (sticky) */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-6 space-y-6">
              {/* Profile card */}
              <Card className="p-0 overflow-hidden">
                <div className="p-6">
                  <SectionTitle icon={User} title="User Profile" />
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                        {profile.photoDataUrl ? (
                          <img src={getImageUrl(profile.photoDataUrl)} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full grid place-items-center text-gray-400">
                            <User className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <label className="absolute -bottom-2 -right-2 inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-900 text-white cursor-pointer shadow-sm">
                        <Camera className="w-3.5 h-3.5" /> Edit
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="col-span-2">
                        <label className="text-xs text-gray-500">Full Name</label>
                        <input
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email</label>
                        <input
                          type="email"
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Age</label>
                        <input
                          type="number"
                          min={0}
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={profile.age}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                          placeholder="22"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Gender</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={profile.gender}
                          onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                        >
                          <option value="">Select</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                          <option>Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Dosha</label>
                        <select
                          className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                          value={profile.dosha}
                          onChange={(e) => setProfile({ ...profile, dosha: e.target.value })}
                        >
                          {DOSHAS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">Streak</div>
                      <div className="text-base font-semibold text-gray-900">{streak} days</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">Balance</div>
                      <div className="text-base font-semibold text-gray-900">{progress}%</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 p-3">
                      <div className="text-xs text-gray-500">Season</div>
                      <div className="flex items-center gap-1 text-base font-semibold text-gray-900">
                        <SeasonIcon /> {season}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <SectionTitle title="🌿 Latest Ayurveda News" accent="text-green-600" />
                <AyurvedaNews />
              </Card>
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-8 space-y-6">
            <Card>
              <SectionTitle icon={Sparkles} title="Dosha Balance" accent="text-amber-600" />
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="bg-primary h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.9 }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span>{progress}% balanced</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-40 accent-current"
                />
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Flame} title="Healing Streak" accent="text-red-600" />
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-gray-900">{streak}</div>
                <div className="text-gray-600">days in a row</div>
              </div>
            </Card>

            <Card>
              <SectionTitle icon={BookOpen} title="Daily Symptom Log" accent="text-blue-600" />
              <textarea
                value={symptomLog}
                onChange={(e) => setSymptomLog(e.target.value)}
                placeholder="Notes for today…"
                className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows={3}
              />
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={logSymptoms}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Log
                </button>
                <span className="text-xs text-gray-500">Last: {lastLogDate || "—"}</span>
              </div>
              {allLogs.length > 0 && (
                <div className="mt-4 space-y-2">
                  {allLogs.slice(0, 3).map((log, i) => (
                    <div key={i} className="text-sm text-gray-700">
                      <span className="text-gray-500">{log.date}:</span> {log.text}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <SectionTitle icon={Trophy} title="Daily Challenges" accent="text-yellow-600" />
              <p className="text-xs text-gray-500 mb-2">Complete a challenge to reveal another one from the pool. Challenges reset daily.</p>
              <ul className="space-y-2">
                {visibleChallenges.length === 0 ? (
                  <li className="text-sm text-gray-500">No more new challenges for today. Well done!</li>
                ) : (
                  visibleChallenges.map((challenge, i) => {
                    const checked = completedChallenges.includes(challenge);
                    return (
                      <li key={challenge} className="flex items-center gap-3">
                        <input
                          id={`ch-${i}`}
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleChallenge(challenge)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                          htmlFor={`ch-${i}`}
                          className={`text-sm ${checked ? "line-through text-gray-400" : "text-gray-800"}`}
                        >
                          {challenge}
                        </label>
                      </li>
                    );
                  })
                )}
              </ul>

              {/* Optionally show a small "upcoming" preview */}
              <div className="mt-3 text-xs text-gray-500">
                {FULL_CHALLENGES_POOL.filter((c) => !visibleChallenges.includes(c) && !completedChallenges.includes(c)).length > 0 ? (
                  <>More challenges are waiting — finish one to reveal the next.</>
                ) : (
                  <>You've seen the whole pool for today.</>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle icon={SeasonIcon} title={`Seasonal Recipes – ${season}`} />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {seasonalRecipes[season].map((r, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                    <div className="font-medium text-gray-900">{r.title}</div>
                    <div className="text-sm text-gray-600">{r.desc}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <SectionTitle icon={Utensils} title="Your Recipes" accent="text-primary" />
              <div className="space-y-4 mb-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Recipe title"
                    value={newRecipe.title}
                    onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                    className="border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <select
                    value={newRecipe.doshaType}
                    onChange={(e) => setNewRecipe({ ...newRecipe, doshaType: e.target.value })}
                    className="border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {DOSHAS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  placeholder="Description"
                  value={newRecipe.description}
                  onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={2}
                />
                <textarea
                  placeholder="Ingredients (one per line)"
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={3}
                />
                <textarea
                  placeholder="Steps"
                  value={newRecipe.steps}
                  onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  rows={4}
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newRecipe.isPublic}
                    onChange={(e) => setNewRecipe({ ...newRecipe, isPublic: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this recipe public
                  </label>
                </div>
                <button
                  onClick={addRecipe}
                  disabled={addingRecipe}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingRecipe ? "Adding..." : <><PlusCircle className="w-4 h-4" /> Add Recipe</>}
                </button>
              </div>

              {loadingRecipes ? (
                <div className="text-sm text-gray-500">Loading recipes...</div>
              ) : userRecipes.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-3">
                  {userRecipes.map((r, i) => (
                    <div key={r._id || i} className="p-4 border border-gray-200 rounded-xl">
                      <div className="font-medium text-gray-900">{r.title}</div>
                      <div className="text-sm text-gray-600 mb-2">{r.description}</div>
                      <div className="text-xs text-gray-500">Dosha: {r.doshaType}</div>
                      {r.isPublic && <div className="text-xs text-green-600">Public</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No recipes yet.</div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

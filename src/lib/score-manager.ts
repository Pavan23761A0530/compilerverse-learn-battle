// Score management with localStorage — includes avatar, admin controls, quiz completion tracking

export interface PlayerScores {
  name: string;
  avatar: string;
  simulator: number;
  phaseChallenge: number;
  quiz: number[];
  quizCompleted: boolean[];
  errorDetective: number;
  total: number;
}

export interface AdminSettings {
  quizActive: boolean[];       // which assessments are active (started by admin)
  phaseChallengeEnabled: boolean;
  errorDetectiveEnabled: boolean;
}

// Predefined avatars
export const AVATARS = ["🤖", "🧠", "💻", "🎮", "🚀", "⚡", "🔮", "🎯"];

const PLAYERS_KEY = "compilerverse_players";
const CURRENT_KEY = "compilerverse_current_player";
const ADMIN_KEY = "compilerverse_admin";
const ADMIN_SETTINGS_KEY = "compilerverse_admin_settings";

// Admin credentials
const ADMIN_USERNAME = "Kommoju Pavan Kumar Ganesh";
const ADMIN_PASSWORD = "Caco32h2o@";

// --- Admin auth ---
export function isAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function loginAsAdmin() {
  localStorage.setItem(ADMIN_KEY, "true");
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

export function isAdmin(): boolean {
  return localStorage.getItem(ADMIN_KEY) === "true";
}

// --- Admin settings ---
export function getAdminSettings(): AdminSettings {
  try {
    const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { quizActive: [false, false, false, false, false], phaseChallengeEnabled: true, errorDetectiveEnabled: true };
}

export function saveAdminSettings(settings: AdminSettings) {
  localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
}

// --- Players ---
export function getPlayers(): PlayerScores[] {
  try {
    const players = JSON.parse(localStorage.getItem(PLAYERS_KEY) || "[]") as PlayerScores[];
    // Migration: ensure new fields
    return players.map(p => ({
      ...p,
      avatar: p.avatar || "🤖",
      quizCompleted: p.quizCompleted || [false, false, false, false, false],
    }));
  } catch { return []; }
}

function savePlayers(players: PlayerScores[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function isNameTaken(name: string): boolean {
  return getPlayers().some(p => p.name.toLowerCase() === name.toLowerCase());
}

export function registerPlayer(name: string, avatar: string): boolean {
  if (isNameTaken(name)) return false;
  const players = getPlayers();
  players.push({
    name, avatar,
    simulator: 0, phaseChallenge: 0,
    quiz: [0, 0, 0, 0, 0],
    quizCompleted: [false, false, false, false, false],
    errorDetective: 0, total: 0,
  });
  savePlayers(players);
  localStorage.setItem(CURRENT_KEY, name);
  return true;
}

export function loginPlayer(name: string) {
  localStorage.setItem(CURRENT_KEY, name);
}

export function getCurrentPlayer(): string | null {
  return localStorage.getItem(CURRENT_KEY);
}

export function logoutPlayer() {
  localStorage.removeItem(CURRENT_KEY);
  logoutAdmin();
}

function recalcTotal(p: PlayerScores): number {
  return p.simulator + p.phaseChallenge + p.quiz.reduce((a, b) => a + b, 0) + p.errorDetective;
}

export function updateScore(section: "simulator" | "phaseChallenge" | "errorDetective", delta: number) {
  const name = getCurrentPlayer();
  if (!name) return;
  const players = getPlayers();
  const p = players.find(x => x.name === name);
  if (!p) return;
  p[section] += delta;
  p.total = recalcTotal(p);
  savePlayers(players);
}

export function updateQuizScore(assessmentIdx: number, score: number) {
  const name = getCurrentPlayer();
  if (!name) return;
  const players = getPlayers();
  const p = players.find(x => x.name === name);
  if (!p) return;
  p.quiz[assessmentIdx] = Math.max(p.quiz[assessmentIdx], score);
  p.quizCompleted[assessmentIdx] = true;
  p.total = recalcTotal(p);
  savePlayers(players);
}

export function hasCompletedQuiz(assessmentIdx: number): boolean {
  const p = getPlayerScores();
  return p?.quizCompleted?.[assessmentIdx] ?? false;
}

export function getPlayerScores(): PlayerScores | null {
  const name = getCurrentPlayer();
  if (!name) return null;
  return getPlayers().find(x => x.name === name) || null;
}

export function getLeaderboard(): PlayerScores[] {
  return getPlayers().sort((a, b) => b.total - a.total).slice(0, 10);
}

export function resetPlayerScores() {
  const name = getCurrentPlayer();
  if (!name) return;
  const players = getPlayers();
  const p = players.find(x => x.name === name);
  if (!p) return;
  p.simulator = 0; p.phaseChallenge = 0;
  p.quiz = [0, 0, 0, 0, 0]; p.quizCompleted = [false, false, false, false, false];
  p.errorDetective = 0; p.total = 0;
  savePlayers(players);
}

// --- Admin CRUD ---
export function adminDeletePlayer(name: string) {
  savePlayers(getPlayers().filter(p => p.name !== name));
}

export function adminResetPlayerScore(name: string) {
  const players = getPlayers();
  const p = players.find(x => x.name === name);
  if (!p) return;
  p.simulator = 0; p.phaseChallenge = 0;
  p.quiz = [0, 0, 0, 0, 0]; p.quizCompleted = [false, false, false, false, false];
  p.errorDetective = 0; p.total = 0;
  savePlayers(players);
}

export function adminResetAllScores() {
  const players = getPlayers();
  players.forEach(p => {
    p.simulator = 0; p.phaseChallenge = 0;
    p.quiz = [0, 0, 0, 0, 0]; p.quizCompleted = [false, false, false, false, false];
    p.errorDetective = 0; p.total = 0;
  });
  savePlayers(players);
}

export function adminDeleteAllPlayers() {
  savePlayers([]);
}

export function adminUpdatePlayer(name: string, updates: Partial<Pick<PlayerScores, "name" | "avatar">>) {
  const players = getPlayers();
  const p = players.find(x => x.name === name);
  if (!p) return;
  if (updates.name) p.name = updates.name;
  if (updates.avatar) p.avatar = updates.avatar;
  savePlayers(players);
}

export function adminClearCompletedExams() {
  const players = getPlayers();
  players.forEach(p => { p.quizCompleted = [false, false, false, false, false]; });
  savePlayers(players);
}

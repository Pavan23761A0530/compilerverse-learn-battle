// Score management with localStorage

export interface PlayerScores {
  name: string;
  simulator: number;
  phaseChallenge: number;
  quiz: number[];
  errorDetective: number;
  total: number;
}

const PLAYERS_KEY = "compilerverse_players";
const CURRENT_KEY = "compilerverse_current_player";

export function getPlayers(): PlayerScores[] {
  try {
    return JSON.parse(localStorage.getItem(PLAYERS_KEY) || "[]");
  } catch { return []; }
}

function savePlayers(players: PlayerScores[]) {
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
}

export function isNameTaken(name: string): boolean {
  return getPlayers().some(p => p.name.toLowerCase() === name.toLowerCase());
}

export function registerPlayer(name: string): boolean {
  if (isNameTaken(name)) return false;
  const players = getPlayers();
  players.push({ name, simulator: 0, phaseChallenge: 0, quiz: [0, 0, 0, 0, 0], errorDetective: 0, total: 0 });
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
  p.total = recalcTotal(p);
  savePlayers(players);
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
  p.simulator = 0;
  p.phaseChallenge = 0;
  p.quiz = [0, 0, 0, 0, 0];
  p.errorDetective = 0;
  p.total = 0;
  savePlayers(players);
}

// Shared app state is currently provided with React Context + localStorage.
// Export hooks here as a single store entry point for future feature integration.
export { useAuth } from "../context/AuthContext";
export { useCommunity } from "../context/CommunityContext";
export { useTheme } from "../context/ThemeContext";

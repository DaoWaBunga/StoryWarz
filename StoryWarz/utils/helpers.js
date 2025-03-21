// utils/helpers.js

/**
 * Generates a random 6-character lobby code
 * @returns {string} - A random 6-character uppercase string
 */
export const generateLobbyCode = () => {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing characters like I, O, 1, 0
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
};

/**
 * Converts an object of player votes to an array for easier rendering
 * @param {Object} votes - Object with player IDs as keys and vote IDs as values
 * @returns {Array} - Array of {voter, vote} objects
 */
export const votesToArray = (votes) => {
  return Object.entries(votes).map(([voter, vote]) => ({
    voter,
    vote
  }));
};

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
 */
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Returns a list of story topics for each round
 * @returns {Array} - Array of topic strings
 */
export const getStoryTopics = () => [
  "Most Epic Party",
  "Worst Date Ever",
  "Craziest Road Trip",
  "Childhood Mishap",
  "Strange Encounter",
  "Embarrassing Moment",
  "Narrowest Escape",
  "Greatest Triumph"
]; 
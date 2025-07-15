// Extracts initials from a full name (e.g., "Yerlam Sai Deepika" → "YS")
export const getInitials = (name = "") => {
  if (!name) return ""

  const words = name.trim().split(" ")
  let initials = ""

  // Use first two words (e.g., "First Last")
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    if (words[i]) initials += words[i][0]
  }

  return initials.toUpperCase()
}

// Validates email format
export const validateEmail = (email = "") => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

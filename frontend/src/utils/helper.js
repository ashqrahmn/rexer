export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const getInitials = (name) => {
    if (!name || typeof name !== 'string') return "";

    const words = name.trim().split(" ");
    let initials = "";

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        if (words[i].length > 0) {
            initials += words[i][0];
        }
    }

    return initials.toUpperCase();
};
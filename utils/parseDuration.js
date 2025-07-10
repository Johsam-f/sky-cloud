exports.parseDuration = (str) => {
    const match = str.match(/^(\d+)([dhm])$/);
    if (!match) return null;
  
    const value = parseInt(match[1]);
    const unit = match[2];
  
    const now = new Date();
  
    switch (unit) {
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      default:
        return null;
    }
  
    return now;
  };
  
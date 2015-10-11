module.exports = {

  string(value, min, max, pattern=false){
    let messages = [];
    if (value.length < 1 ) { messages.push("is required."); }
    if (value.length < min || value.length > max ) { messages.push(`must be between ${min} & ${max} charactors.`); }
    if ( pattern && ! pattern.pattern.test(value) ) { messages.push(pattern.message)};

    return {
      valid: messages.length === 0,
      messages: messages
    };
  },

  int(num, min, max){
    let messages = [];
    num = parseInt(num);

    if (!num && num !== 0) { messages.push("is required."); }
    if (num < min || num > max ) { messages.push(`must be between ${min} & ${max}`); }

    return {
      valid: messages.length === 0,
      messages: messages
    };
  }

};

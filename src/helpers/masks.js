export const maskCpf = (text) => {
    // Remove caracteres não numéricos
    text = text.replace(/\D/g, '');
  
    // Aplica a máscara (###.###.###-##)
    if (text.length <= 3) {
      return text;
    } else if (text.length <= 6) {
      return `${text.slice(0, 3)}.${text.slice(3)}`;
    } else if (text.length <= 9) {
      return `${text.slice(0, 3)}.${text.slice(3, 6)}.${text.slice(6)}`;
    } else {
      return `${text.slice(0, 3)}.${text.slice(3, 6)}.${text.slice(6, 9)}-${text.slice(9, 11)}`;
    }
}

export const maskPhone = (text) => {
    // Remove caracteres não numéricos
    text = text.replace(/\D/g, '');
  
    // Aplica a máscara (##) #####-####
    if (text.length <= 2) {
      return text;
    } else if (text.length <= 7) {
      return `(${text.slice(0, 2)}) ${text.slice(2)}`;
    } else if (text.length <= 11) {
      return `(${text.slice(0, 2)}) ${text.slice(2, 7)}-${text.slice(7)}`;
    } else {
      return `(${text.slice(0, 2)}) ${text.slice(2, 7)}-${text.slice(7, 11)}`;
    }
  };
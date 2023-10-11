function formatarData(data) {
    const date = new Date(data);
    const optionsData = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsHora = { hour: '2-digit', minute: '2-digit' };
    const dataFormatada = date.toLocaleDateString('pt-BR', optionsData);
    const horaFormatada = date.toLocaleTimeString('pt-BR', optionsHora);
    return `${dataFormatada} - ${horaFormatada}`;
}

export default formatarData;

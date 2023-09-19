export const decimalDigitsMask = (value, casasDecimais) => {
    
    if(value.trim() === ''){
        let text = '0,'
        for (let i = 0; i < casasDecimais; i++) {
            text += '0'
        }
        text = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: casasDecimais }).format(
            parseFloat(text) / 10 ** casasDecimais
          )
        return text
    }
    value = value.replace('.', '').replace(',', '').replace(/\D/g, '')

    const options = { minimumFractionDigits: casasDecimais }
    const result = new Intl.NumberFormat('pt-BR', options).format(
      parseFloat(value) / 10 ** casasDecimais
    )
    
    return result
    // if ( (parseFloat(value) / 10 ** casasDecimais) >= 1000 ){
    //     return result
    // }else{
    //     return result
    // }
}
const checkData = (data) =>{
    let ff = true; 
    for(var key in data){
        ff = ff && checkLength(data[key])        
    }
    return ff;
}
const checkLength = (data) =>{
    return data.length < 2
}

const consistsOfLetters = (text) => {
    const regex = /^[a-zA-ZЁёА-я_ .-]*\w{5,}$/;
    return regex.test(text);
  };
export  {checkData,consistsOfLetters}
export const firebaselooper =(snapshot) =>{
    let data =[];
snapshot.forEach(doc => {
    data.push({
        ...doc.data(),
        id: doc.id
    })
});

    return data;
}

export const getAge = (dateString) => {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}
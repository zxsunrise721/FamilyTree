
export const getCurrentFamily =() => {
    let family = window.sessionStorage.getItem('current-family');
    return !!family ? JSON.parse(family) : null;
}

export const getCurrentFamilyTree = () =>{
    let tree = window.sessionStorage.getItem('family-tree');
    return !!tree ? JSON.parse(tree) : null;
}
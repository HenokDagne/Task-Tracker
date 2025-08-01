
export async function fetchCategories() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token){
            console.error('No authentication token found');
            return [];
        }
        const response = await fetch('/category/', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                "Authorization": `Token ${token}`
             }
            
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // If backend returns a list of objects, extract names
       // renderCategories(data);
        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}

const renderCategories = (categories) => {
    const categoriesList = document.querySelector("#category-list");
    if (typeof categories === 'object' && categories !== null) {
        Object.entries(categories).forEach(([Key, value]) => {
            const categotryItem = document.createElement('div');
            categotryItem.className = 'flex items-center justify-between';
            const span = document.createElement('span');
        } )
    }



}
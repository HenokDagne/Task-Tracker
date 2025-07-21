
export async function fetchCategories() {
    try {
        const response = await fetch('/category/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // If backend returns a list of objects, extract names
        if (Array.isArray(data)) {
            return data.map(cat => cat.name || cat);
        }
        return [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
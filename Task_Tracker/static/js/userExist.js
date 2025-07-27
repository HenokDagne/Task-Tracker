function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const user_exist = (username) => {
    async function is_exist() {
        const csrftoken = getCookie('csrftoken'); // Get CSRF token from cookie

        try {
             const token = localStorage.getItem('authToken'); // Get token from storage
             const response = await fetch('/user/is-exist/}', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': csrftoken,
                            'Authorization': `Token ${token}`
                        },
                        body: JSON.stringify({ email: email })
                    });
             if (!response.ok){
                throw new Error('Network response was not ok');
             } 
             const data = await response.json();
             console.log(data);
             return true;   
                   
        }catch (error) {
            console.error('Error fetching search results:', error);
            
        }
       

    
        
    }
}
window.addEventListener('DOMContentLoaded',user_exist('weyna'))
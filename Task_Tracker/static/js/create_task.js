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

export async function createTask(task, categoryChoice, progress, date, description) {
    console.log(task, categoryChoice, progress, date, description);
    const category = {
        "wrok": 8,
        "personal": 9,
        "health": 15,
        "finance": 13,
        "study":10,
        "development": 11,
        "other": 16,
    }
    let category_id;
    let key = categoryChoice.trim().toLowerCase();
    console.log("key: ", key);

    if (category[key]){
        category_id = category[key];
        console.log('Category ID:', category_id);
    }else {
        console.error('Invalid category choice:', categoryChoice);
        return;

    }
    const csrftoken = getCookie('csrftoken');
    try {
        
        const token = localStorage.getItem('authToken'); // Get token from storage
        const response = await fetch('/task/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
                "Authorization": `Token ${token}`
            },
            body: JSON.stringify({
                title: task,
                category: category_id,
                progress: progress,
                Due_Date: date, // Use the exact field name from your serializer/model
                description: description,
                profile: 33 // <-- Add this if profile is required (use correct ID)
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Backend error:', errorData);
            throw new Error('Network response Was not ok');
        } else {
            console.log('Task created successfully');
        }
    } catch (error) {
        console.error('Error creating task:', error);
    }
}
// Helper to get CSRF token from cookie
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
        "work": 8,
        "personal": 9,
        "health": 12,
        "finance": 13,
        "study":10,
        "Development": 11,
        "other": 14,
    }
    let category_id;
    if (category[categoryChoice]){
        category_id = category[categoryChoice];
        console.log('Category ID:', category_id);
    }else {
        console.error('Invalid category choice:', categoryChoice);
        return;
    }
    try {
        
        
        const response = await fetch('/task/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken
            },
            body: JSON.stringify({
                title: task,
                category: category_id,
                progress: progress,
                Due_Date: date, // Use the exact field name from your serializer/model
                description: description,
                profile: 7 // <-- Add this if profile is required (use correct ID)
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
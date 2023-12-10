async function getUserInfo()
{
    let id, name, items;

    // Checks if there is information about the user
    if (!localStorage.getItem("user_id") || !localStorage.getItem("name"))
    {
        if (!window.location.href.endsWith('/welcome')) {
            window.location.href = '/welcome';
        }
    }

    // If ther is information about user, updates the items
    id = localStorage.getItem("user_id");
    name = localStorage.getItem("name");

    const response = await fetch("/items", {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: id,
    })
    items = await response.json();
    items = items.items;

    localStorage.setItem("items", items);
    return {id, name, items};
}

(async () => {
    const user = await getUserInfo();
    console.log(user);
})();

async function sendName() {
    // Check if name isn't empty
    if (document.getElementById("name").value === null || document.getElementById("name").value.trim() === '') {
        alert("Ievadiet savu vārdu");
        return;
    }
    let name = document.getElementById("name").value;

    // Fetches the new user id and items (sends the name of user)
    const response = await fetch("/newuser", {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: name,
    })

    if (response.ok) {
        user = await response.json();
        id = user.id + ''; // Turns id to string so it is consistent for both a new and returning user
        items = user.items;

        // Sets info about user in local storage
        localStorage.setItem("user_id", id);
        localStorage.setItem("name", name);
        localStorage.setItem("items", items);
        window.location.href = "/";
    }
}
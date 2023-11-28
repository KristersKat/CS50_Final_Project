async function getUserInfo()
{
    let id, name, items;

    // Checks if there is information about the user
    if (!localStorage.getItem("user_id") || !localStorage.getItem("name"))
    {
        window.location.href = '/welcome';
        // Wont run after being redirected, but might be useful in the welcome page
        /*let name;
        // Check if name isn't empty
        do
        {
            name = prompt("Enter your name"); // Edit to change the way the script prompts for a name
        } while (name === null || name.trim() === '')

        // Fetches the new user id and items (sends the name of user)
        const response = await fetch("http://127.0.0.1:5000/newuser", {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: name,
        })
        user = await response.json();
        id = user.id + ''; // Turns id to string so it is consistent for both a new and returning user
        items = user.items;

        // Sets info about user in local storage
        localStorage.setItem("user_id", id);
        localStorage.setItem("name", name);
        localStorage.setItem("items", items);
        return {id, name, items};*/
    }

    // If ther is information about user, updates the items
    id = localStorage.getItem("user_id");
    name = localStorage.getItem("name");

    const response = await fetch("http://127.0.0.1:5000/items", {
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
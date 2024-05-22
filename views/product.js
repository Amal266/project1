function calculateCost() {
    const startDate = new Date(document.getElementById('startDate').value);
    const endDate = new Date(document.getElementById('endDate').value);

    if (startDate > endDate) {
        alert('End date must be equal to or after the start date.');
        return;
    }

    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const costPerDay = 27; // Set your cost per day
    const totalCost = daysDiff * costPerDay;

    // Store both the total cost and number of days in local storage
    localStorage.setItem('totalCost', totalCost);
    localStorage.setItem('days', daysDiff);

    // Redirect to the cart page or update the UI as needed
    window.location.href = 'cart.html';
}

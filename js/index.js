
const endpoint = 'https://savings-goals-api.onrender.com/savingsGoals';


function formAppear() {

    const fbtn = document.getElementById('form-btn');
    fbtn.addEventListener('click', () => {
        const form = document.getElementById('form-section');

        form.innerHTML = `
            <form id="goalForm">
                <div class="input-box-container">
                    <div class="input-box">
                        <input type="text" id="goalName" placeholder="Goal Name" required>
                    </div>

                    <div class="input-box">
                        <input type="number" id="targetAmount" placeholder="Target Amount" required>
                    </div>

                    <div class="input-box">
                        <input type="date" id="deadline" required>
                    </div>

                    <div class="btn-box">
                        <button class="form-btn" type="submit">Add Goal</button>
            
                        <button class="form-btn" id="close" type="submit">Close</button>
                    </div>
                </div>
            </form>
        `;


        document.getElementById('close').addEventListener('click', () => {
            form.innerHTML = "";
        });

        document.getElementById('goalForm').addEventListener('submit', addGoal);
});
}




function fetchGoals() {
    fetch(endpoint)
    .then(response => response.json())
    .then(goals => {
        renderGoals(goals);
        renderDashboard(goals);
    })

}



function renderGoals(goals) {
    const container = document.getElementById('goalsContainer');

    container.innerHTML = '';

    goals.forEach(goal => {
        
        const progress = (goal.savedAmount / goal.targetAmount) * 100;
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        

        container.innerHTML += `
            <div class="goal">
                <h3>${goal.goalName}</h3>
                <svg class="progress-container" width="100" height="100" viewBox="0 0 100 100">
                    <circle class="progress-ring progress-ring-background" cx="50" cy="50" r="40" stroke-width="10" stroke="#e0e0e0"></circle>
                    <circle class="progress-ring progress-ring-progress" cx="50" cy="50" r="40" stroke-width="10" stroke="#4caf50" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}" transform="rotate(-90 50 50)"></circle>
                    <text x="50" y="50" class="progress-text">${progress.toFixed(2)}%</text>
                </svg>
                <p>Target: Ksh ${goal.targetAmount} <br>Saved: Ksh ${goal.savedAmount}</p>
                <button class="modbtn" data-id="${goal.id}">Modify</button>
                <div id="openMod-${goal.id}"></div>
                
            </div>
        `;

        container.addEventListener("click", function (event) {
            const goalId = event.target.getAttribute("data-id");

            if (event.target.classList.contains("modbtn")) {
                
                const mod = document.getElementById(`openMod-${goalId}`);
               
                console.log(mod);
                console.log(goalId);


                mod.innerHTML = `
                    <input type="number" placeholder="Deposit Amount" id="deposit-${goalId}">
                    <button class="deposit-btn" data-id="${goalId}">Deposit</button>
                    <button class="delete-btn" id="deletebtn" data-id="${goalId}"">Delete</button>
                    <br>
                    <button class="close-btn" id="closeMod" data-id="${goalId}">Close</button>
                `;
            }
        
            if (event.target.classList.contains("delete-btn")) {
                deleteGoal(goalId);
            }

            if (event.target.classList.contains("close-btn")) {
                closeModify(goalId);
            }

            if (event.target.classList.contains("deposit-btn")) {
                updateSavings(goalId);
            }
        });
    });
            
}


    

function closeModify(id) {
    const mod = document.getElementById(`openMod-${id}`);
    mod.innerHTML = ``;
}



function renderDashboard(goals){
    
    let = totalSavings = 0
    goals.forEach(goal =>{
        totalSavings += goal.savedAmount
        document.getElementById('T-Saving').textContent = totalSavings;
    })

    let = goalsAchieved = 0
    goals.forEach(goal =>{
        if(goal.savedAmount >= goal.targetAmount){
            goalsAchieved += 1
            document.getElementById('G-Achieved').textContent = goalsAchieved;
        }
        else{
            goalsAchieved += 0
            document.getElementById('G-Achieved').textContent = goalsAchieved;
        }
    })

    let = goalsPending = 0
    goals.forEach(goal =>{
        if(goal.savedAmount < goal.targetAmount){
            goalsPending += 1
            document.getElementById('G-Pending').textContent = goalsPending;
        }
        else{
            goalsPending += 0
            document.getElementById('G-Pending').textContent = goalsPending;
        }
    })
}




function addGoal(event) {
    event.preventDefault();
    const goalName = document.getElementById('goalName').value;
    const targetAmount = document.getElementById('targetAmount').value;
    const deadline = document.getElementById('deadline').value;
    const newGoal = { 
        goalName, 
        targetAmount: Number(targetAmount), 
        savedAmount: 0, 
        deadline 
    };

    fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGoal)
    })
    .then(() => fetchGoals()) 
}



function updateSavings(id) {
    const depositInput = document.getElementById(`deposit-${id}`);
    const depositAmount = Number(depositInput.value);
    fetch(`${endpoint}/${id}`)
            .then(response => response.json())
            .then(goal => {
                goal.savedAmount += depositAmount;
                return fetch(`${endpoint}/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ savedAmount: goal.savedAmount })
                });
            })
            .then(() => fetchGoals())
}




function deleteGoal(id) {
    fetch(
        `${endpoint}/${id}`, 
        { method: 'DELETE' }
    )
    .then(() => fetchGoals())
}



function main() {
    fetchGoals();
    formAppear();
}

main();
let balance = 10000;
let portfolio = { bitcoin: 0, ethereum: 0, solana: 0 };
let currentPrice = 0;

// 1. Récupérer le prix de la crypto sélectionnée
async function getPrice() {
    const crypto = document.getElementById('crypto-select').value;
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=eur`);
        const data = await response.json();
        currentPrice = data[crypto].eur;
        document.getElementById('crypto-price').innerText = currentPrice.toLocaleString() + " €";
    } catch (error) {
        document.getElementById('crypto-price').innerText = "Erreur API";
    }
}

// 2. Fonction d'achat
function buyCrypto() {
    const crypto = document.getElementById('crypto-select').value;
    const amountToSpend = parseFloat(document.getElementById('amount').value);

    if (isNaN(amountToSpend) || amountToSpend <= 0) {
        alert("Entrez un montant valide");
        return;
    }

    if (amountToSpend > balance) {
        alert("Fonds insuffisants");
        return;
    }

    // Calcul
    const quantity = amountToSpend / currentPrice;
    balance -= amountToSpend;
    portfolio[crypto] += quantity;

    updateUI(crypto, amountToSpend, quantity);
}

// 3. Mise à jour de l'interface
function updateUI(crypto, spent, qty) {
    // Mise à jour solde
    document.getElementById('balance').innerText = balance.toFixed(2);
    
    // Mise à jour portefeuille texte
    document.getElementById('assets').innerHTML = `
        <p>BTC: ${portfolio.bitcoin.toFixed(4)} | 
           ETH: ${portfolio.ethereum.toFixed(4)} | 
           SOL: ${portfolio.solana.toFixed(2)}</p>
    `;

    // Ajouter à l'historique
    const list = document.getElementById('history-list');
    const entry = document.createElement('li');
    entry.innerHTML = `<span class="buy-msg">Achat</span> ${qty.toFixed(4)} ${crypto.toUpperCase()} pour ${spent}€`;
    list.prepend(entry); // Ajoute en haut de la liste
}

// Actualisation automatique
setInterval(getPrice, 15000);
getPrice();
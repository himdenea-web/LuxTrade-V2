let balance = 10000;
let portfolio = { bitcoin: 0, ethereum: 0, solana: 0 };
let currentPrice = 0;


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

    
    const quantity = amountToSpend / currentPrice;
    balance -= amountToSpend;
    portfolio[crypto] += quantity;

    updateUI(crypto, amountToSpend, quantity);
}


function updateUI(crypto, spent, qty) {
    
    document.getElementById('balance').innerText = balance.toFixed(2);
    
    
    document.getElementById('assets').innerHTML = `
        <p>BTC: ${portfolio.bitcoin.toFixed(4)} | 
           ETH: ${portfolio.ethereum.toFixed(4)} | 
           SOL: ${portfolio.solana.toFixed(2)}</p>
    `;

    
    const list = document.getElementById('history-list');
    const entry = document.createElement('li');
    entry.innerHTML = `<span class="buy-msg">Achat</span> ${qty.toFixed(4)} ${crypto.toUpperCase()} pour ${spent}€`;
    list.prepend(entry); 
}


setInterval(getPrice, 15000);
getPrice();

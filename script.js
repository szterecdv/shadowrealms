// script.js - Végleges verzió

// ====================================
// A TE ADATAID: CSERÉLD LE EZEKET!
// ====================================

const MC_IP = "shadowrealmswebsite.sytes.net"; 
const MC_PORT = "25565";
const VAULT_KEY = "SHADOWREALMS"; // 🔑 AZ EXKLUZÍV KULCSSZÓ!

// ÚJ: CÉL IDŐPONT: ÁLLÍTSD BE IDE A JÖVŐBENI DÁTUMOT!
const COUNTDOWN_TARGET_DATE = new Date("Nov 15, 2024 18:00:00").getTime(); 

// ====================================
// 1. IP MÁSOLÓ FUNKCIÓ
// ====================================

function copyIP(ip) {
    navigator.clipboard.writeText(ip)
        .then(() => {
            alert(`A szerver IP címe (${ip}) sikeresen másolva! ✅`);
        })
        .catch(err => {
            console.error('Nem sikerült a másolás: ', err);
            alert(`Kérem, másolja ki manuálisan az IP-t: ${ip}`);
        });
}

// ====================================
// 2. MINECRAFT STÁTUSZ ELLENŐRZÉS
// ====================================

async function checkServerStatus() {
    const statusText = document.getElementById('mc-status-text');
    const playersElement = document.getElementById('mc-players');
    if (!statusText || !playersElement) return; 

    const url = `https://api.minetools.eu/ping/${MC_IP}/${MC_PORT}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.online) {
            statusText.textContent = 'ONLINE';
            statusText.className = 'status-online';
            playersElement.textContent = `(${data.players.now}/${data.players.max} Játékos)`;
        } else {
            statusText.textContent = 'OFFLINE';
            statusText.className = 'status-offline';
            playersElement.textContent = '(Jelenleg nem elérhető)';
        }
    } catch (error) {
        console.error("Hiba a szerver állapot lekérdezésekor:", error);
        statusText.textContent = 'HIBA';
        statusText.className = 'status-offline';
        playersElement.textContent = '(Ellenőrizd a konzolt!)';
    }
}

// ====================================
// 3. SHADOW VAULT FUNKCIÓ 
// ====================================

function unlockVault() {
    const inputField = document.getElementById('vault-key');
    const lockDiv = document.getElementById('vault-lock');
    const contentDiv = document.getElementById('vault-content');

    if (!inputField || !lockDiv || !contentDiv) return;

    const input = inputField.value.toUpperCase().trim();

    if (input === VAULT_KEY) {
        // Sikeres nyitás
        lockDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        document.getElementById('vault-card').style.borderColor = 'var(--accent-cyan)';
        // KIS FUNKCIÓ: A videó automatikus elindítása (ha engedélyezve van a YouTube beállításokban)
        const iframe = contentDiv.querySelector('iframe');
        if (iframe) {
             iframe.src += "?autoplay=1"; // Próbálja elindítani
        }
        alert('VAULT FELOLDVA! Exkluzív tartalom elérhető! ▶️');
    } else {
        // Sikertelen nyitás
        alert('Helytelen Jelszó. Figyelj jobban a streamre/videóra!');
        inputField.value = '';
    }
}

// ====================================
// 4. ESEMÉNY VISSZASZÁMLÁLÓ
// ====================================

function updateCountdown() {
    const now = new Date().getTime();
    const distance = COUNTDOWN_TARGET_DATE - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
        // Esemény lejárt, eltávolítja a visszaszámlálót
        clearInterval(countdownInterval);
        const countdownBox = document.getElementById("countdown-box");
        if (countdownBox) {
            countdownBox.innerHTML = 
                '<p style="font-size: 1.5em; color: var(--accent-purple);">AZ ESEMÉNY ELKEZDŐDÖTT! Csapj bele!</p>';
        }
    }
}

// ====================================
// 5. INDÍTÁS
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    checkServerStatus(); 
    setInterval(checkServerStatus, 60000); 
    
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);
});

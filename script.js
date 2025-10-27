// ====================================
// A TE ADATAID: CSERÉLD LE EZEKET!
// ====================================

const MC_IP = "shadowrealms.sytes.net";
const MC_PORT = "25565";
const VAULT_KEY = "SHADOWREALMS"; // 🔑 AZ EXKLUZÍV KULCSSZÓ! Ezt mondd el a videódban/streameden!

// ====================================
// 1. IP MÁSOLÓ FUNKCIÓ
// ====================================

function copyIP(ip) {
    navigator.clipboard.writeText(ip)
        .then(() => {
            alert(`A szerver IP címe (${ip}) sikeresen másolva!`);
        })
        .catch(err => {
            console.error('Nem sikerült a másolás: ', err);
            alert(`Kérem, másolja ki manuálisan az IP-t: ${ip}`);
        });
}

// ====================================
// 2. MINECRAFT STÁTUSZ ELLENŐRZÉS
// ====================================
// NOTE: Egy nyilvános API-t használ, ami nem garantáltan megbízható a jövőben.

async function checkServerStatus() {
    const statusText = document.getElementById('mc-status-text');
    const playersElement = document.getElementById('mc-players');
    if (!statusText || !playersElement) return; // Megakadályozza a futást más oldalakon, ahol nincs widget

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
// 3. SHADOW VAULT FUNKCIÓ (community.html)
// ====================================

function unlockVault() {
    const inputField = document.getElementById('vault-key');
    if (!inputField) return; // Csak a community.html oldalon fut

    const input = inputField.value.toUpperCase().trim();
    const lockDiv = document.getElementById('vault-lock');
    const contentDiv = document.getElementById('vault-content');

    if (input === VAULT_KEY) {
        // Sikeres nyitás
        lockDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        document.getElementById('vault-card').style.border = '3px solid var(--accent-cyan)';
        alert('VAULT FELOLDVA! Exkluzív tartalom elérhető!');
    } else {
        // Sikertelen nyitás
        alert('Helytelen Jelszó. Nézted a legújabb videót/streamet?');
        inputField.value = '';
    }
}

// ====================================
// 4. OLDAL BETÖLTÉSI FÜGGVÉNYEK
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    // Futtatja a státusz ellenőrzést, majd frissíti 60 másodpercenként
    checkServerStatus(); 
    setInterval(checkServerStatus, 60000); 
});
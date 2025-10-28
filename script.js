// script.js - A funkciók alapja (Végső, kibővített verzió)

// ====================================
// A TE ADATAID: CSERÉLD LE EZEKET!
// ====================================
const MC_IP = "shadowrealmswebsite.sytes.net"; 
const MC_PORT = "25565";
const VAULT_KEY = "SHADOWREALMS"; 
const COUNTDOWN_TARGET_DATE = new Date("Dec 24, 2025 15:00:00").getTime(); 

// 🚨 ÚJ: Háttérképek listája
const BACKGROUND_IMAGES = {
    default: 'url("https://via.placeholder.com/1920x900/0D0A1A/A020F0?text=SHADOW+REALMS+ENTRANCE")',
    nebula: 'url("https://via.placeholder.com/1920x900/100030/FF00FF?text=NEBULA+TEXTURE")',
    matrix: 'url("https://via.placeholder.com/1920x900/000000/00FF00?text=MATRIX+GLITCH")',
};

// ====================================
// 1. GLOBÁLIS ÉS ALAP FUNKCIÓK
// ====================================

function copyIP(ip) {
    navigator.clipboard.writeText(ip)
        .then(() => {
            // alert(`A szerver IP címe (${ip}) sikeresen másolva! ✅`); // KIVÉVE
        })
        .catch(err => {
            console.error('Nem sikerült a másolás: ', err);
            // alert(`Kérem, másolja ki manuálisan az IP-t: ${ip}`); // KIVÉVE
        });
}

// 🚨 Frissített frissítési intervallum kezelése
async function checkServerStatus() {
    const statusText = document.getElementById('mc-status-text');
    const playersElement = document.getElementById('mc-players');
    if (!statusText || !playersElement) return; 

    try {
        const response = await fetch(`https://api.minetools.eu/ping/${MC_IP}/${MC_PORT}`);
        const data = await response.json();
        if (data && data.online) {
            statusText.textContent = 'ONLINE';
            statusText.className = 'status-online';
            playersElement.textContent = `(${data.players.now}/${data.players.max} Játékos)`;
            logToDevConsole('Server Status: ONLINE. Player count updated.');
        } else {
            throw new Error("Szerver offline vagy hiba történt.");
        }
    } catch (error) {
        statusText.textContent = 'OFFLINE';
        statusText.className = 'status-offline';
        playersElement.textContent = '(Ellenőrizd az IP-t!)';
        logToDevConsole('Server Status: OFFLINE. Failed to fetch status.', 'error');
    }
}

function unlockVault() {
    const inputField = document.getElementById('vault-key');
    const lockDiv = document.getElementById('vault-lock');
    const contentDiv = document.getElementById('vault-content');
    if (!inputField || !lockDiv || !contentDiv) return;

    const input = inputField.value.toUpperCase().trim();

    if (input === VAULT_KEY) {
        lockDiv.style.display = 'none';
        contentDiv.style.display = 'block';
        document.getElementById('vault-card').style.borderColor = 'var(--accent-cyan)';
        
        const iframe = contentDiv.querySelector('iframe');
        if (iframe) {
            let src = iframe.src;
            if (src.includes('autoplay')) {
                src = src.replace(/autoplay=\d/, 'autoplay=1');
            } else {
                src += src.includes('?') ? "&autoplay=1" : "?autoplay=1";
            }
            iframe.src = src;
        }
        alert('VAULT FELOLDVA! Exkluzív tartalom elérhető! ▶️'); // Ez az alert maradhat
        logToDevConsole('VAULT UNLOCKED successfully.');
    } else {
        alert('Helytelen Jelszó. Figyelj jobban a streamre/videóra!'); // Ez az alert maradhat
        inputField.value = '';
        logToDevConsole('VAULT UNLOCK failed: Invalid key entered.', 'error');
    }
}

// 🚨 ÚJ: Fejlesztői mód logolása
function logToDevConsole(message, type = 'info') {
    const consoleDiv = document.getElementById('dev-console-log');
    if (!consoleDiv) return;

    const logEntry = document.createElement('p');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] [${type.toUpperCase()}] ${message}`;
    logEntry.className = `log-${type}`;
    
    // Csak az utolsó 50 sort tartjuk meg
    if (consoleDiv.children.length >= 50) {
        consoleDiv.removeChild(consoleDiv.firstChild);
    }
    consoleDiv.appendChild(logEntry);
    // Görgessük az aljára
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

// ====================================
// 2. 🚨 FRISSÍTETT BEÁLLÍTÁSOK MENÜ LOGIKÁJA 
// ====================================

// SEGÉDFÜGGVÉNY A BEÁLLÍTÁSOK ÉRTÉKÉNEK MENTÉSÉRE (Csendes)
function saveSetting(key, value) {
    localStorage.setItem(key, value);
    logToDevConsole(`Beállítás mentve: ${key} = ${value}`);
}

function toggleSettings() {
    const menu = document.getElementById('settings-menu');
    if (menu) {
        menu.classList.toggle('active'); 
        logToDevConsole(`Beállítások menü: ${menu.classList.contains('active') ? 'Megnyitva' : 'Bezárva'}`);
    }
}

// === ALBEÁLLÍTÁSOK FUNKCIÓI ===

// Téma (Szín) beállítás
function setTheme(themeName) {
    let cyan = '#00FFFF';
    let purple = '#A020F0';
    
    switch (themeName) {
        case 'purple':
            cyan = '#A020F0';
            purple = '#00FFFF';
            break;
        case 'red':
            cyan = '#FF004D';
            purple = '#FFD700';
            break;
        case 'cyan':
        default:
            break;
    }

    document.documentElement.style.setProperty('--accent-cyan', cyan);
    document.documentElement.style.setProperty('--accent-purple', purple);
    saveSetting('shadowRealmsTheme', themeName);
}

// 🚨 ÚJ: Háttér textúra beállítása
function setBackground(textureName) {
    const bgUrl = BACKGROUND_IMAGES[textureName] || BACKGROUND_IMAGES.default;
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        heroSection.style.backgroundImage = bgUrl;
    }
    saveSetting('backgroundTexture', textureName);
}

// Neon Box Árnyék Intenzitás beállító
function setBoxIntensity(value) {
    const intensity = value / 100;
    document.documentElement.style.setProperty('--box-shadow-intensity', intensity);
    saveSetting('boxShadowIntensity', intensity);
}

// Szöveg árnyék Intenzitás beállító
function setTextIntensity(value) {
    const intensity = value / 100;
    document.documentElement.style.setProperty('--text-shadow-intensity', intensity);
    saveSetting('textShadowIntensity', intensity);
}

// Háttér Sötétítés beállító
function setDarkness(value) {
    const darkness = value / 100;
    document.documentElement.style.setProperty('--bg-darkness-level', darkness);
    saveSetting('darknessLevel', darkness);
}

// Betűtípus váltó
function setFont(fontName) {
    const font = fontName === 'cinzel' ? 'var(--font-title)' : "'Roboto', sans-serif";
    document.documentElement.style.setProperty('--font-body', font);
    saveSetting('fontStyle', fontName);
}

// 🚨 ÚJ: Szerver Frissítés Intervallumának beállítása
function setUpdateInterval(minutes) {
    const ms = minutes * 60 * 1000;
    saveSetting('updateIntervalMinutes', minutes);
    logToDevConsole(`Frissítési intervallum beállítva: ${minutes} perc.`);
    
    // Ha már fut egy intervallum, állítsuk le
    if (window.serverStatusInterval) {
        clearInterval(window.serverStatusInterval);
    }
    // Indítsuk el az új intervallumot, kivéve ha 0-ra van állítva
    if (minutes > 0) {
        window.serverStatusInterval = setInterval(checkServerStatus, ms);
    } else {
        logToDevConsole('Automatikus szerverstátusz frissítés kikapcsolva.');
    }
}

// 🚨 ÚJ: Fejlesztői mód kapcsoló
function toggleDevMode(enabled) {
    const devConsole = document.getElementById('dev-console');
    if (devConsole) {
        devConsole.classList.toggle('active', enabled);
    }
    saveSetting('devModeEnabled', enabled);
    logToDevConsole(`Fejlesztői mód: ${enabled ? 'ENGEDÉLYEZVE' : 'LETILTVA'}`);
}


// Visszaállítás alapértelmezettre
function resetSettings() {
    if (confirm("Biztosan vissza szeretnéd állítani az összes beállítást az alapértelmezettre?")) {
        // Töröljük az összes beállítást
        localStorage.clear(); 
        
        applySettings(); // Alapértelmezett értékek betöltése
        logToDevConsole('Összes beállítás visszaállítva az alapértelmezettre.');
        // Visszaállítás után újraindítjuk a frissítési intervallumot, ha kell
        setUpdateInterval(5); 
        alert("Beállítások sikeresen visszaállítva az alapértelmezettre! (5 perces frissítés bekapcsolva)");
    }
}


// Visszaállítás a mentett értékekre
function applySettings() {
    // 1. Téma
    const savedTheme = localStorage.getItem('shadowRealmsTheme') || 'cyan';
    setTheme(savedTheme);
    
    // 2. Háttér Textúra
    const savedTexture = localStorage.getItem('backgroundTexture') || 'default';
    setBackground(savedTexture);

    // 3. Neon Intenzitások
    const savedBoxIntensity = parseFloat(localStorage.getItem('boxShadowIntensity')) || 0.8;
    setBoxIntensity(savedBoxIntensity * 100);
    const boxSlider = document.getElementById('box-intensity-slider');
    if (boxSlider) boxSlider.value = savedBoxIntensity * 100;
    
    const savedTextIntensity = parseFloat(localStorage.getItem('textShadowIntensity')) || 1.0;
    setTextIntensity(savedTextIntensity * 100);
    const textSlider = document.getElementById('text-intensity-slider');
    if (textSlider) textSlider.value = savedTextIntensity * 100;

    // 4. Sötétség Szint
    const savedDarknessLevel = parseFloat(localStorage.getItem('darknessLevel')) || 0.0;
    setDarkness(savedDarknessLevel * 100);
    const darknessSlider = document.getElementById('darkness-slider');
    if (darknessSlider) darknessSlider.value = savedDarknessLevel * 100;

    // 5. Betűtípus
    const savedFont = localStorage.getItem('fontStyle') || 'roboto';
    setFont(savedFont);

    // 6. IP Automatikus Másolás
    const savedAutoCopy = localStorage.getItem('autoCopyIP') === 'true';
    const autoCopyCheckbox = document.getElementById('toggle-autocopy');
    if (autoCopyCheckbox) autoCopyCheckbox.checked = savedAutoCopy;

    // 7. Szerver Frissítés Intervallum
    const savedUpdateInterval = parseInt(localStorage.getItem('updateIntervalMinutes')) || 5; // Alap: 5 perc
    const intervalSlider = document.getElementById('update-interval-slider');
    if (intervalSlider) {
        intervalSlider.value = savedUpdateInterval;
        document.getElementById('interval-value-display').textContent = savedUpdateInterval;
    }
    setUpdateInterval(savedUpdateInterval);

    // 8. Fejlesztői Mód
    const savedDevMode = localStorage.getItem('devModeEnabled') === 'true';
    const devModeCheckbox = document.getElementById('toggle-dev-mode');
    if (devModeCheckbox) {
        devModeCheckbox.checked = savedDevMode;
    }
    toggleDevMode(savedDevMode);
}


// ÚJ, BŐVÍTETT HTML TARTALOM
const settingsHTML = `
    <div class="settings-content">
        <button class="close-btn" onclick="toggleSettings()">&times;</button>
        <h2><i class="fas fa-cog"></i> Általános Beállítások</h2>
        
        <div class="setting-group">
            <h3><i class="fas fa-desktop"></i> Megjelenés</h3>
            <div class="setting-item">
                <h4>Téma Színek</h4>
                <div class="theme-options">
                    <button onclick="setTheme('cyan')" style="background-color: #00FFFF;">KÉK NEON</button>
                    <button onclick="setTheme('purple')" style="background-color: #A020F0;">LILA NEON</button>
                    <button onclick="setTheme('red')" style="background-color: #FF004D;">PIROS NEON</button>
                </div>
            </div>
            
            <div class="setting-item">
                <h4>Háttér Textúra</h4>
                <div class="theme-options">
                    <button onclick="setBackground('default')" style="background-color: #111;">Alapértelmezett</button>
                    <button onclick="setBackground('nebula')" style="background-color: #311;">Nebula</button>
                    <button onclick="setBackground('matrix')" style="background-color: #010;">Matrix</button>
                </div>
            </div>

            <div class="setting-item">
                <h4>Betűtípus</h4>
                <div class="theme-options">
                     <button onclick="setFont('roboto')" style="background-color: #555; margin-left: 0;">Roboto (Alap)</button>
                     <button onclick="setFont('cinzel')" style="background-color: #555;">Cinzel (Címsor)</button>
                </div>
            </div>
        </div>

        <div class="setting-group">
            <h3><i class="fas fa-lightbulb"></i> Neon Részletesség</h3>
            <div class="setting-item">
                <h4>Doboz Árnyék Erőssége</h4>
                <input type="range" min="10" max="100" value="80" class="slider" 
                       id="box-intensity-slider" 
                       oninput="setBoxIntensity(this.value)">
            </div>
            <div class="setting-item">
                <h4>Szöveg Árnyék Erőssége</h4>
                <input type="range" min="10" max="100" value="100" class="slider" 
                       id="text-intensity-slider" 
                       oninput="setTextIntensity(this.value)">
            </div>
        </div>
        
        <div class="setting-group">
             <h3><i class="fas fa-wrench"></i> Teljesítmény és Eszközök</h3>
             <div class="setting-item">
                <h4>Háttér Sötétség (Kontraszt)</h4>
                <input type="range" min="0" max="100" value="0" class="slider" 
                       id="darkness-slider" 
                       oninput="setDarkness(this.value)">
            </div>
            <div class="setting-item">
                <h4>Szerver Frissítés Intervallum</h4>
                <p>Minden <span id="interval-value-display">5</span> percben</p>
                <input type="range" min="0" max="30" step="1" value="5" class="slider" 
                       id="update-interval-slider" 
                       oninput="document.getElementById('interval-value-display').textContent = this.value; setUpdateInterval(this.value);">
            </div>
            <div class="setting-item">
                <h4>IP Másolás</h4>
                <label>
                    <input type="checkbox" id="toggle-autocopy" 
                           onchange="toggleAutoCopy(this.checked)"> 
                    Oldal betöltésekor automatikusan másolja az IP-t
                </label>
            </div>
            
            <div class="setting-item">
                <h4>Fejlesztői Mód</h4>
                <label>
                    <input type="checkbox" id="toggle-dev-mode" 
                           onchange="toggleDevMode(this.checked)"> 
                    Fejlesztői konzol engedélyezése
                </label>
            </div>
        </div>

        <hr style="border-color: rgba(160, 32, 240, 0.5); margin: 30px 0;">

        <button class="cta-vault-button" 
                style="background-color: #FF6060; margin: 0 auto; display: block;"
                onclick="resetSettings()">
            <i class="fas fa-undo"></i> Minden beállítás törlése
        </button>
    </div>
`;


// ====================================
// 3. EGYÉB FUNKCIÓK & INDÍTÁS
// ====================================

function updateCountdown() {
    const now = new Date().getTime();
    const distance = COUNTDOWN_TARGET_DATE - now;

    const elements = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    if (Object.values(elements).every(el => el)) {
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            elements.days.textContent = String(days).padStart(2, '0');
            elements.hours.textContent = String(hours).padStart(2, '0');
            elements.minutes.textContent = String(minutes).padStart(2, '0');
            elements.seconds.textContent = String(seconds).padStart(2, '0');
        } else {
            clearInterval(window.countdownInterval);
            const countdownBox = document.getElementById("countdown-box");
            if (countdownBox) {
                countdownBox.innerHTML = 
                    '<p style="font-size: 1.5em; color: var(--accent-purple);">AZ ESEMÉNY ELKEZDŐDÖTT! CSATLAKOZZ MOST!</p>';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Beállítások menü tartalmának behelyezése és betöltése
    const settingsMenu = document.getElementById('settings-menu');
    if (settingsMenu) {
        settingsMenu.innerHTML = settingsHTML;
        // Azonnal töltse be a beállításokat (ezzel állítja be az intervallumot is)
        applySettings(); 
    }
    
    // Kezdeti szerverstátusz ellenőrzés
    checkServerStatus(); 
    
    if (document.getElementById("countdown-box")) {
        updateCountdown();
        window.countdownInterval = setInterval(updateCountdown, 1000);
    }
});
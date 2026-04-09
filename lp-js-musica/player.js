document.addEventListener('DOMContentLoaded', () => {
    // --- Seleciona os elementos do DOM ---
    const audio = document.getElementById('radio-stream');
    const playPauseBtn = document.getElementById('play-pause-button');
    const volumeSlider = document.getElementById('volume-slider');
    const statusText = document.getElementById('status-text');
    
    // Elementos dinâmicos do programa
    const programTitleEl = document.getElementById('player-program-title');
    const programLocutorEl = document.getElementById('player-program-locutor');
    const programLogoEl = document.getElementById('player-program-logo');
    const defaultLogoSrc = programLogoEl ? programLogoEl.src : '';

    if (!audio || !playPauseBtn || !volumeSlider || !statusText || !programTitleEl || !programLocutorEl || !programLogoEl) {
        console.error("Player de rádio: um ou mais elementos essenciais não foram encontrados no DOM.");
        return;
    }
    
    const iconPlay = playPauseBtn.querySelector('.icon-play');
    const iconPause = playPauseBtn.querySelector('.icon-pause');
    let isPlaying = false;

    // --- Lógica do Player ---
    function updateUI() {
        if (isPlaying) {
            iconPlay.style.display = 'none';
            iconPause.style.display = 'block';
            statusText.textContent = 'Tocando...';
            playPauseBtn.setAttribute('aria-label', 'Pausar a rádio');
        } else {
            iconPlay.style.display = 'block';
            iconPause.style.display = 'none';
            statusText.textContent = 'Pausado';
            playPauseBtn.setAttribute('aria-label', 'Tocar a rádio');
        }
    }

    function togglePlayPause() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.error("Erro ao tentar tocar o áudio:", error);
                statusText.textContent = 'Erro ao tocar';
            });
        } else {
            audio.pause();
        }
    }

    function setVolume() {
        audio.volume = volumeSlider.value / 100;
    }

    // --- Lógica da Programação Dinâmica ---
    async function fetchCurrentProgram() {
        try {
            const response = await fetch(radio_player_params.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    action: 'get_current_program',
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.json();

            if (result.success && result.data) {
                updatePlayerInfo(result.data);
            }

        } catch (error) {
            console.error('Erro ao buscar a programação:', error);
        }
    }
    
    function updatePlayerInfo(data) {
        if (data.on_air) {
            programTitleEl.textContent = data.title;
            programLocutorEl.textContent = data.locutor;
            if (data.thumbnail) {
                programLogoEl.src = data.thumbnail;
            } else {
                programLogoEl.src = defaultLogoSrc;
            }
        } else {
            // Volta para o padrão
            programTitleEl.textContent = data.title || 'Liberdade FM';
            programLocutorEl.textContent = data.locutor || 'Música no Ar';
            programLogoEl.src = defaultLogoSrc;
        }
    }

    // --- Inicialização ---
    playPauseBtn.addEventListener('click', togglePlayPause);
    volumeSlider.addEventListener('input', setVolume);
    
    audio.onplaying = () => { isPlaying = true; updateUI(); };
    audio.onpause = () => { isPlaying = false; updateUI(); };
    audio.onerror = () => {
        console.error("Erro no stream de áudio.");
        statusText.textContent = 'Stream indisponível';
        isPlaying = false;
        updateUI();
    };

    setVolume();
    updateUI();
});


const YOUTUBE_CONFIG = {
    CHANNEL_ID: 'UCZI8ehZkyxWwiOQv3pZ-RAw',
    MAX_RESULTS: 6,
    FALLBACK_VIDEOS: [
        {
            title: "Five Nights at Freddy’s Pela Primeira Vez — Mysti",
            thumbnail: "https://i.ytimg.com/vi/-v1A8nZPus0/hqdefault.jpg",
            description: "Se quiserem mais FNAF, trago para vocês!",
            videoId: "-v1A8nZPus0"
        },
        {
            title: "Mic Consertado 👍",
            thumbnail: "https://i.ytimg.com/vi/XYfA3VEYh-k/hqdefault.jpg",
            description: "Agora a frequência volta ao normal👍",
            videoId: "XYfA3VEYh-k"
        },
        {
            title: "Dois idiotas sobrevivendo no OneBlock ‪@Luxzin‬",
            thumbnail: "https://i.ytimg.com/vi/V--ugV8aaAM/hqdefault.jpg",
            description: "Só os assuntos aleatórios e Robertinho do grau sumiu KKKKK Espero que gostem!",
            videoId: "V--ugV8aaAM"
        }
    ]
};

// Elementos do DOM
const DOM = {
    videoGrid: document.querySelector('.video-grid'),
    subscribeBtn: document.querySelector('.subscribe-btn')
};

// Função para buscar vídeos do canal via API
async function fetchYouTubeVideos() {
    try {
        const response = await fetch('/api/proxy'); // Chama a função serverless
        if (!response.ok) throw new Error('Erro na resposta da API');
        const data = await response.json();
        return data || []; // Retorna os vídeos
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        return null;
    }
}

// Cria o HTML de um card de vídeo
function createVideoCard(video) {
    const isAPIResponse = video.hasOwnProperty('snippet');
    const videoData = isAPIResponse ? {
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.high.url,
        description: video.snippet.description,
        videoId: video.id.videoId
    } : video;

    return `
      <div class="video-card">
        <a href="https://www.youtube.com/watch?v=${videoData.videoId}" target="_blank" rel="noopener noreferrer">
          <img src="${videoData.thumbnail}" alt="${videoData.title}" class="video-thumbnail" loading="lazy">
        </a>
        <div class="video-info">
          <h3 class="video-title">${videoData.title}</h3>
          <p class="video-description">${truncateDescription(videoData.description)}</p>
          <a href="https://www.youtube.com/watch?v=${videoData.videoId}" target="_blank" rel="noopener noreferrer" class="video-link">
            <i class="fab fa-youtube"></i> Assistir
          </a>
        </div>
      </div>
    `;
}

// Limita o tamanho da descrição
function truncateDescription(description, maxLength = 100) {
    return description.length > maxLength
        ? `${description.substring(0, maxLength)}...`
        : description;
}

// Carrega os vídeos na página
async function loadVideos() {
    let videos = await fetchYouTubeVideos();

    // Se a API falhar, usa os vídeos de fallback
    if (videos === null) {
        videos = YOUTUBE_CONFIG.FALLBACK_VIDEOS;
    }

    if (!videos || videos.length === 0) {
        DOM.videoGrid.innerHTML = '<p class="no-videos">Nenhum vídeo encontrado.</p>';
        return;
    }

    // Limpa o conteúdo existente
    DOM.videoGrid.innerHTML = '';

    // Adiciona os vídeos ao grid
    videos.forEach(video => {
        DOM.videoGrid.innerHTML += createVideoCard(video);
    });
}

// Event Listeners
function setupEventListeners() {
    DOM.subscribeBtn.addEventListener('click', () => {
        window.open('https://www.youtube.com/@TastyMysti', '_blank', 'noopener,noreferrer');
    });

    window.addEventListener('load', loadVideos);
}

// Inicialização
function init() {
    setupEventListeners();
}

// Inicia a aplicação
init();

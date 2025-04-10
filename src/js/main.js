/**
 * Configurações do YouTube
 * @type {Object}
 */
const CONFIG_YOUTUBE = {
    ID_CANAL: 'UCZI8ehZkyxWwiOQv3pZ-RAw',
    MAX_RESULTADOS: 6,
    VIDEOS_RESERVA: [
        {
            titulo: "Five Nights at Freddy's Pela Primeira Vez — Mysti",
            miniatura: "https://i.ytimg.com/vi/-v1A8nZPus0/hqdefault.jpg",
            descricao: "Se quiserem mais FNAF, trago para vocês!",
            idVideo: "-v1A8nZPus0"
        },
        {
            titulo: "Mic Consertado 👍",
            miniatura: "https://i.ytimg.com/vi/XYfA3VEYh-k/hqdefault.jpg",
            descricao: "Agora a frequência volta ao normal👍",
            idVideo: "XYfA3VEYh-k"
        },
        {
            titulo: "Dois idiotas sobrevivendo no OneBlock ‪@Luxzin‬",
            miniatura: "https://i.ytimg.com/vi/V--ugV8aaAM/hqdefault.jpg",
            descricao: "Só os assuntos aleatórios e Robertinho do grau sumiu KKKKK Espero que gostem!",
            idVideo: "V--ugV8aaAM"
        }
    ]
};

/**
 * Elementos do DOM
 * @type {Object}
 */
const DOM = {
    gradeVideos: document.querySelector('.video-grid'),
    botaoInscrever: document.querySelector('.subscribe-btn')
};

/** 
 * Busca Vídeos do YouTube através da API
 * @returns {Promise<Array |null>} Array de vídeos ou null se ocorrer algum erro
*/
async function buscarVideosYouTube() {
    try {
        const resposta = await fetch('/api/proxy');
        if (!resoista.ok) throw new Error('Erro na resposta da API');
        return await resposta.json();
    } catch (erro) {
        console.log('Erro ao buscar vídeos:', erro);
        return null;
    }
}

/** 
 * Cria o HTML de um card de video
 * @param {Object} video - Objeto com dados do vídeo
 * @returns {string} HTML do card de video
*/
function criarCardVideo(video) {
    const ehRespostaAPI = 'snippet' in video;
    const dadosVideo = ehRespostaAPI ? {
        titulo: video.snippet.title,
        miniatura: video.snippet.thumbnails.high.url,
        descricao: video.snippet.description,
        idVideo: video.id.videoId
    } : video;

    return `
        <div class="video-card">
            <a href="https://www.youtube.com/watch?v=${dadosVideo.idVideo}" target="_blank" rel="noopener noreferrer">
                <img src="${dadosVideo.miniatura}" alt="${dadosVideo.titulo}" class="video-thumbnail" loading="lazy">
            </a>
            <div class="video-info">
                <h3 class="video-title">${dadosVideo.titulo}</h3>
                <p class="video-description">${encurtarDescricao(dadosVideo.descricao)}</p>
                <a href="https://www.youtube.com/watch?v=${dadosVideo.idVideo}" target="_blank" rel="noopener noreferrer" class="video-link">
                    <i class="fab fa-youtube"></i> Assistir
                </a>
            </div>
        </div>
    `;
}

/**
 * Encurtar a descricao do video se for muito longa
 * @param {string} descricao - Descricao do video
 * @returns {number} [tamanhoMax=100] - Tamanho máximo permitido
 * @returns {string} - Descricao encurtada
 */
function encurtarDescricao(descricao = '', tamanhoMax = 100) {
    return descricao.length > tamanhoMax ? `${descricao.substring(0, tamanhoMax)}...` : descricao;
}

/**
 * Carrega os vídeos na página
 */
async function carregarVideos() {
    let videos = await buscarVideosYouTube();

    // Usa vídeos de reserva se a API falhar
    if (videos === null) {
        videos = CONFIG_YOUTUBE.VIDEOS_RESERVA;
    }

    if (!videos?.length) {
        DOM.gradeVideos.innerHTML = '<p class="no-videos">Nenhum vídeo encontrado.</p>';
        return;
    }

    // Limpa o conteúdo existente
    DOM.gradeVideos.innerHTML = '';

    // Adiciona vídeos à grade
    DOM.gradeVideos.innerHTML = videos.map(criarCardVideo).join('');
}

/**
 * Configura os eventos da página
 */
function configurarEventos() {
    DOM.botaoInscrever.addEventListener('click', () => {
        window.open('https://www.youtube.com/@TastyMysti', '_blank', 'noopener,noreferrer');
    });

    window.addEventListener('load', carregarVideos);
}

// Inicializa a aplicação
function iniciar() {
    configurarEventos();
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', iniciar);
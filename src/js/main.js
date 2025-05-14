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
    ],
    PARCEIROS: [
        {
            id: 'UCA-I1T1cUQat2NCQrLT4yog',
            username: 'maryy_catti',
            nome: '『•°Maryyh⚝•』',
            cargo: 'Editora do Canal',
            roleClass: 'editor',
            avatarFallback: './src/media/avatar-marry.webp'
        },
        {
            id: 'UCWB6M4TcUv-IsGgKQZDA6sg',
            username: 'Luxzin',
            nome: 'Lux',
            cargo: 'Colaborador',
            roleClass: 'collaborator',
            avatarFallback: './src/media/avatar-lux.webp'
        },
        {
            id: 'UCTb2pwB8ac1ixtf9qtMneuA',
            username: 'zw4396',
            nome: 'ZW4',
            cargo: 'Colaborador',
            roleClass: 'collaborator',
            avatarFallback: './src/media/avatar-zw4.webp',
            isDeveloper: true
        },
        {
            id: 'UCAiXstEhgvH-f9uZSF-6M4g',
            username: 'E.mo_Raro',
            nome: 'Emo_Raro',
            cargo: 'Colaborador',
            roleClass: 'collaborator',
            avatarFallback: './src/media/avatar-emo-raro.webp'
        },
        {
            id: 'UCgShhelldNNR7pnA6GnMQaw',
            username: 'ViniDark2',
            nome: 'ViniDark',
            cargo: 'Colaborador',
            roleClass: 'collaborator',
            avatarFallback: './src/media/avatar-vinidark.webp'
        }
    ]
};

/**
 * Elementos do DOM
 * @type {Object}
 */
const DOM = {
    gradeVideos: document.querySelector('.video-grid'),
    botaoInscrever: document.querySelector('.subscribe-btn'),
    containerParceiros: document.getElementById('partners-container')
};

/** 
 * Busca Vídeos do YouTube através da API
 * @returns {Promise<Array |null>} Array de vídeos ou null se ocorrer algum erro
*/
async function buscarVideosYouTube() {
    try {
        const resposta = await fetch('/api/proxy');
        if (!resposta.ok) throw new Error('Erro na resposta da API');
        return await resposta.json();
    } catch (erro) {
        console.log('Erro ao buscar vídeos:', erro);
        return null;
    }
}

/** 
 * Busca estatísticas do canal através da API
 * @param {string} channelId - ID do canal no YouTube
 * @returns {Promise<Object|null>} Objeto com estatísticas ou null se ocorrer erro
 */
async function buscarEstatisticasCanal(channelId) {
    try {
        const resposta = await fetch(`/api/proxy?id=${channelId}`);
        if (!resposta.ok) throw new Error('Erro na resposta da API');
        return await resposta.json();
    } catch (erro) {
        console.log('Erro ao buscar estatísticas do canal:', erro);
        return null;
    }
}

/**
 * Formata o número de inscritos para exibição
 * @param {number|string} subscribers - Número de inscritos
 * @returns {string} Número formatado
 */
function formatarInscritos(subscribers) {
    const num = parseInt(subscribers);
    if (isNaN(num)) return subscribers;

    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + ' mi';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + ' mil';
    }
    return num.toString();
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
 * Cria o HTML de um card de parceiro
 * @param {Object} parceiro - Dados do parceiro
 * @param {Object} stats - Estatísticas do canal
 * @returns {string} HTML do card
 */
function criarCardParceiro(parceiro, stats) {
    const avatar = stats?.thumbnail || parceiro.avatarFallback;
    const subscribers = stats?.subscriberCount
        ? formatarInscritos(stats.subscriberCount)
        : 'Carregando...';

    return `
        <a href="https://www.youtube.com/@${parceiro.username}" 
           class="partner-card ${parceiro.roleClass}" 
           target="_blank" 
           rel="noopener noreferrer">
            <div class="partner-avatar">
                <img src="${avatar}" alt="${parceiro.nome}" class="partner-img" loading="lazy">
                ${parceiro.isDeveloper ? '<span class="dev-badge"><i class="fas fa-code"></i> Dev</span>' : ''}
            </div>
            <h3 class="partner-name">${parceiro.nome}</h3>
            <p class="partner-role">${parceiro.cargo}</p>
            <span class="partner-subscribers">${subscribers}</span>
        </a>
    `;
}

/**
 * Encurtar a descricao do video se for muito longa
 * @param {string} descricao - Descricao do video
 * @param {number} [tamanhoMax=100] - Tamanho máximo permitido
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
 * Carrega os parceiros na página
 */
async function carregarParceiros() {
    if (!DOM.containerParceiros) return;

    // Exibe skeleton loading
    DOM.containerParceiros.innerHTML = CONFIG_YOUTUBE.PARCEIROS.map(() => `
        <div class="partner-card skeleton">
            <div class="partner-avatar skeleton"></div>
            <h3 class="partner-name skeleton"></h3>
            <p class="partner-role skeleton"></p>
            <span class="partner-subscribers skeleton"></span>
        </div>
    `).join('');

    // Carrega os dados de cada parceiro
    const parceirosComStats = await Promise.all(
        CONFIG_YOUTUBE.PARCEIROS.map(async parceiro => {
            const stats = await buscarEstatisticasCanal(parceiro.id);
            return { parceiro, stats };
        })
    );

    // Atualiza o container com os dados reais
    DOM.containerParceiros.innerHTML = parceirosComStats
        .map(({ parceiro, stats }) => criarCardParceiro(parceiro, stats))
        .join('');
}

/**
 * Configura os eventos da página
 */
function configurarEventos() {
    DOM.botaoInscrever?.addEventListener('click', () => {
        window.open('https://www.youtube.com/@TastyMysti', '_blank', 'noopener,noreferrer');
    });

    window.addEventListener('load', () => {
        carregarVideos();
        carregarParceiros();
    });
}

// Inicializa a aplicação
function iniciar() {
    configurarEventos();
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', iniciar);
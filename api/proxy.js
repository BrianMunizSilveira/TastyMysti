export default async function handler(req, res) {
    const apiKey = process.env.PRIVATE_API_KEY;
    
    // Verifica se é uma requisição para estatísticas de canal
    if (req.query.id) {
        return handleChannelStats(req, res, apiKey);
    }
    
    // Requisição padrão para lista de vídeos
    return handleVideoList(req, res, apiKey);
}

async function handleVideoList(req, res, apiKey) {
    const channelId = 'UCZI8ehZkyxWwiOQv3pZ-RAw';
    const maxResults = 6;
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Erro na resposta da API do YouTube:', response.status, response.statusText);
            return res.status(response.status).json({ error: 'Erro ao acessar a API do YouTube' });
        }

        const data = await response.json();
        res.status(200).json(data.items || []);
    } catch (error) {
        console.error('Erro ao buscar vídeos:', error);
        res.status(500).json({ error: 'Erro ao buscar vídeos' });
    }
}

async function handleChannelStats(req, res, apiKey) {
    const channelId = req.query.id;
    
    if (!channelId) {
        return res.status(400).json({ error: 'ID do canal não fornecido' });
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=statistics,snippet`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error('Erro na resposta da API do YouTube:', response.status, response.statusText);
            return res.status(response.status).json({ error: 'Erro ao acessar a API do YouTube' });
        }

        const data = await response.json();
        
        if (!data.items || data.items.length === 0) {
            return res.status(404).json({ error: 'Canal não encontrado' });
        }

        const channelData = data.items[0];
        res.status(200).json({
            subscriberCount: channelData.statistics.subscriberCount,
            thumbnail: channelData.snippet.thumbnails.default.url,
            title: channelData.snippet.title
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas do canal:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas do canal' });
    }
}
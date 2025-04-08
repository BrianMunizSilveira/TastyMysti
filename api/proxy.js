export default async function handler(req, res) {
    const apiKey = process.env.PRIVATE_API_KEY;
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

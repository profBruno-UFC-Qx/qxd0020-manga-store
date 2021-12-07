import { MangaService } from "./services/mangaService";
import { createServer, IncomingMessage, request, ServerResponse } from 'http';
import * as path from 'path';
import { Server} from 'node-static';
import { AddressInfo } from "net";


const PORT = 8080;
const fileServer = new Server('./public');

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const mangaService = new MangaService();
    
    async function getAll(){
        const mangas = await mangaService.getAll();
        res.writeHead(200, {'Content-type': 'text/html'});
        let content = "<tr>";
        
        for (let i in mangas) {
            let line = `<td><img src="/img/one_piece/${path.basename(mangas[i].cover.toString())}" alt="${mangas[i].title}"><br>${mangas[i].volumeNumber} - ${mangas[i].title}<br><strong>Preço: R$${Number(mangas[i].price).toFixed(2)}</strong></td>`;


            if((Number(i) + 1)  % 5 == 0) {
                content += `${line}</tr><tr>`;
            } else {
                content += line;
            }
                
        }

        res.end(
            `<html lang="pt-br">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                </head>
                <body>
                    <table>
                        <caption>Mangas</caption>
                        <tbody>
                        ${content}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
    };

    if(req.url === '/') {
        if (req.method == 'GET') {
            res.statusCode = 200;
            getAll();
        }
    } else if (req.url?.startsWith('/img')) {
        fileServer.serve(req, res);
    }  
});

server.listen(PORT, "127.0.0.1", () => {
    const { address, port } = server.address() as AddressInfo;
    console.log(`Server listening on http://${address}:${port} `);
});








import http from 'http';
import url from 'url';
import fs from 'fs';
import { Buffer } from 'buffer';
import { buffer } from 'stream/consumers';

const server = http.createServer((req, res) => {
    const parse = url.parse(req.url, true);
    const method = req.method;
    const pathname = parse.pathname;

    if (method === "GET" && pathname === "/ping") {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let numeros = [];
        for (let i = 0; i < 15; i++) {
            numeros.push(i + 1);
        }
        res.end(JSON.stringify({ msg: "Tudo certo, servidor de pé", objeto: numeros }));
        return;
    }
    if (method === "GET" && pathname === "/cat") {
        (async function cat() {
            let resposta = await fetch("https://cataas.com/cat")
            let arrayBuffer = await resposta.arrayBuffer();
            let buffer = Buffer.from(arrayBuffer)

            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(buffer);
        })()
        return
    }
    if (method === "POST" && pathname === "/apiGoogleFonts") {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            let pessoa;

            try {
                pessoa = JSON.parse(body);
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: "JSON inválido" }));
                return;
            }

            try {
                const resposta = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key${pessoa.id}`);
                const responseBody = await resposta.json();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseBody));
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: "Erro ao buscar fontes" }));
            }
        });

        return;
    }
    if (method === "POST" && pathname === "/cadastro") {
        let bodyPessoa = "";
        req.on('data', chunk => { bodyPessoa += chunk.toString(); });
        req.on('end', () => {
            let pessoa;
            try {
                pessoa = JSON.parse(bodyPessoa);
            } catch (e) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ erro: "JSON inválido" }));
                return;
            }

            let erro = false;
            let formErro = {};

            if (!pessoa.nome) {
                erro = true;
                formErro.nome = "Sem nome não salva, parceiro";
            }
            if (!pessoa.email) {
                erro = true;
                formErro.email = "Sem email não salva, parceiro";
            }
            if (!pessoa.senha) {
                erro = true;
                formErro.senha = "Sem senha não salva, parceiro";
            }
            if (pessoa.senha.length <= 5) {
                erro = true
                formErro.senha = "A senha tem que ter mais que 5 caracteres"
            }
            if (erro) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(formErro));
                return;
            }

            fs.appendFile("Pessoas.json", JSON.stringify(pessoa) + "\n", (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ erro: "Erro ao salvar pessoa" }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ pessoa }));
            });
        });
        return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ msg: "Rota não encontrada." }));
});

server.listen(3000, () => {
    console.log("Servidor de pé, esperando requisições");
});

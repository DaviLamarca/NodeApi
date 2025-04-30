import http from 'http';
import url from 'url';
import fs from 'fs';

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

    if (method === "POST" && pathname === "/cadastro") {
        let bodyPessoa = "";
        req.on('data', chunk => { bodyPessoa += chunk.toString(); });
        req.on('end', () => {
            let pessoa = JSON.parse(bodyPessoa);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(pessoa));
        });
        return;
    }

    if (method === "POST" && pathname === "/ajuda") {
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

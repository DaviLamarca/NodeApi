import http from 'http'
import url from 'url'
import fs from 'fs'

const server = http.createServer((req, res) => {
    const parse = url.parse(req.url, true);
    const method = req.method;
    const pathname = parse.pathname;

    let URLBase = "/"

    if (method === "GET" && pathname === "/ping") {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        let numeros = []
        for (let i = 0; i < 15; i++) {
            numeros += i + 1
        }
        res.end(JSON.stringify({ msg: "Tudo certo, serve de pé", objeto: numeros }))
        return
    }

    if (method === "POST" && pathname === "/cadastro") {
        let bodyPessoa = ""
        req.on('data', chunk => {
            bodyPessoa += chunk.toString()
        });

        req.on('end', () => {
            let pessoa = JSON.parse(bodyPessoa)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify(pessoa))
        });
        return
    }

    if (method === "POST" && pathname === "/ajuda") {
        let bodyPessoa = "";

        req.on('data', chunk => {
            bodyPessoa += chunk.toString();
        });

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

            if (erro) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(formErro));
                return;
            }
            fs.appendFile("Pessoas.json", pessoa, (err) => {
                if (err) {
                    console.log(err);
                    return
                }

            })
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ pessoa }));
        });

        return;
    }


    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ msg: "Rota não encontrada." }))
    return
})
server.listen(3000, () => {
    console.log("servidor de pé, esperando requisições")
})
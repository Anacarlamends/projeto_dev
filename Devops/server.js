const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5500;

//  lida com solicitações JSON
app.use(express.json());

// Rota para obter todas as reservas
app.get('/reservas', (req, res) => {
    fs.readFile('./data/reservas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler as reservas');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Rota para obter uma reserva específica
app.get('/reservas/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./data/reservas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler as reservas');
            return;
        }
        const reservas = JSON.parse(data);
        const reserva = reservas.find(reserva => reserva.id === id);
        if (!reserva) {
            res.status(404).send('Reserva não encontrada');
            return;
        }
        res.json(reserva);
    });
});

// Rota para criar uma nova reserva
app.post('/reservas', (req, res) => {
    const novaReserva = req.body;
    fs.readFile('./data/reservas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler as reservas');
            return;
        }
        const reservas = JSON.parse(data);
        novaReserva.id = Math.random().toString(36).substring(7); // Gera um ID aleatório
        reservas.push(novaReserva);
        fs.writeFile('./data/reservas.json', JSON.stringify(reservas), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao salvar a nova reserva');
                return;
            }
            res.json(novaReserva);
        });
    });
});

// Rota para atualizar uma reserva existente
app.put('/reservas/:id', (req, res) => {
    const { id } = req.params;
    const novaReserva = req.body;
    fs.readFile('./data/reservas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler as reservas');
            return;
        }
        const reservas = JSON.parse(data);
        const index = reservas.findIndex(reserva => reserva.id === id);
        if (index === -1) {
            res.status(404).send('Reserva não encontrada');
            return;
        }
        reservas[index] = novaReserva;
        fs.writeFile('./data/reservas.json', JSON.stringify(reservas), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao atualizar a reserva');
                return;
            }
            res.json(novaReserva);
        });
    });
});

// Rota para excluir uma reserva
app.delete('/reservas/:id', (req, res) => {
    const { id } = req.params;
    fs.readFile('./data/reservas.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao ler as reservas');
            return;
        }
        const reservas = JSON.parse(data);
        const index = reservas.findIndex(reserva => reserva.id === id);
        if (index === -1) {
            res.status(404).send('Reserva não encontrada');
            return;
        }
        reservas.splice(index, 1);
        fs.writeFile('./data/reservas.json', JSON.stringify(reservas), err => {
            if (err) {
                console.error(err);
                res.status(500).send('Erro ao excluir a reserva');
                return;
            }
            res.send('Reserva excluída com sucesso');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor Node.js rodando em http://localhost:${PORT}`);
});

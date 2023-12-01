const express = require('express')
const app = express()
const mongoose = require('mongoose')
app.use(express.json())

const dotenv=require('dotenv')


if(process.env.OMG === "DEV"){
    dotenv.config({path:'./config/.env.dev'})
}
if(process.env.OMG === "PROD"){
    dotenv.config({path:'./config/.env.prod'})
}


const modelodeUsuario = mongoose.model('contas', new mongoose.Schema({
    email: String,
    senha: String,
    endereço: String,
    cidade: String,
    cep: String,
    estado: String,
    telefone: String,
    eadmin: Boolean
}))

const modelodeProduto = mongoose.model('produtos', new mongoose.Schema({
    nomedoProduto: String,
    valordoProduto: String
}))

mongoose.connect('mongodb://127.0.0.1:27017/aaaa') // process.env.URL
 .then(()=>{

app.post('/login/', async (req,res)=>{
    const usuarioEncontrado = await modelodeUsuario.findOne({email: req.body.email, senha: req.body.senha})
    if(usuarioEncontrado === null){
        return res.send('Usuário não encontrado')
    }
    res.send(usuarioEncontrado)
})
app.post('/cadastro',async (req,res) =>{
    const usuarioCriado = await modelodeUsuario.create({email: req.body.email, senha: req.body.senha, endereço: req.body.endereço, cidade: req.body.cidade, cep: req.body.cep, estado: req.body.estado, telefone: req.body.telefone, admin: req.body.admin})
    res.send(usuarioCriado)
})


app.post('/postProdutos/admin',async (req,res) =>{
    const usuarioEncontrado = await modelodeUsuario.findOne({email: req.body.email, senha: req.body.senha})
    if (usuarioEncontrado.eadmin === null) {
        return res.send('Usuário não permitido (tem que ser admin)')
    }
    const produtoCriado = await modelodeProduto.create({nomedoProduto: req.body.nomedoProduto, valordoProduto: req.body.valordoProduto})
    res.send(produtoCriado)
})

app.post('/getProdutos/', async (req,res)=>{
    const produtoEncontrado = await modelodeProduto.findOne({nomedoProduto: req.body.nomedoProduto, valordoProduto: req.body.valordoProduto})
    if(!produtoEncontrado){
        return res.send('Produto não encontrado')
    }
    res.send(produtoEncontrado)
})

app.put('/putProdutos', async (req,res)=>{
    const produtoAtualizado = await modelodeProduto.findOneAndUpdate(
        {nomedoProduto: req.body.nomedoProduto, valordoProduto: req.body.valordoProduto},
        {nomedoProduto: req.body.novoNomedoProduto, valordoProduto: req.body.novoValordoProduto},
        {new: true})
    res.send(produtoAtualizado)
})

app.delete('/deleteProdutos', async (req,res)=>{
    const produtoDeletado = await modelodeProduto.deleteOne({nomedoProduto: req.body.nomedoProduto, valordoProduto: req.body.valordoProduto})
    res.send(produtoDeletado)
})



app.put('/put', async (req,res)=>{
    const usuarioAtualizado = await modelodeUsuario.findOneAndUpdate({email: req.body.email, senha: req.body.senha}, {email: req.body.novoemail, senha: req.body.novasenha})
    res.send({ message: "Dados atualizados com sucesso!" })
})
  
app.delete('/delete', async (req,res)=>{
    const usuarioDeletado = await modelodeUsuario.deleteOne({email: req.body.email, password: req.body.password})
    res.send(usuarioDeletado)
})  

app.use((req,res)=>{
    res.send('Não foi possível encontrar sua rota')
})

app.listen(7000, ()=>console.log(`o servidor ta rodando :) ${7000}`))

})
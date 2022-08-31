const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var web3lib = require('web3');
//Ganache RPC Server
var web3 = new web3lib(new web3lib.providers.HttpProvider("http://localhost:1234"));

// test purposes, change to your own address and private key
var myAddress = '0x5C914494d7B405167C19295b06992Ae68f8B205b';
var myPrivatekey = '1b46feeb57c92662b8edf460909e1335b7773e4696bb856ee27988cea63ec162';

corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/balance', async (req, res) => {
    const balance = await web3.eth.getBalance(myAddress);
    res.send({balance: web3.utils.fromWei(balance, 'ether')});
});

app.get('/balance/:address', async (req, res) => {
    const balance = await web3.eth.getBalance(req.params.address);
    res.send({balance: web3.utils.fromWei(balance, 'ether')});
});

app.post('/transaction', async (req, res) => {
    const {to, value} = req.body;
    const transaction = {from: myAddress, to, value: web3.utils.toWei(value.toString(), 'ether'), gas: 30000};
    const signedTx = await web3.eth.accounts.signTransaction(transaction, myPrivatekey);
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash) {
        if(error) {
            res.send(error);
        }
        res.send({message: 'Done',hash});
    });
});

app.get('/wallets', async (req, res) => {
    const wallets = await web3.eth.getAccounts();
    res.send(wallets);
});

app.get('/transactions_count/:address', async (req, res) => {
    const transactions = await web3.eth.getTransactionCount(req.params.address);
    res.send({total:transactions});
});

app.get('/block/actual', async (req, res) => {
    const blockNumber = await web3.eth.getBlockNumber();
    res.send({blockNumber});
});

app.get('/block/:number', async (req, res) => {
    const block = await web3.eth.getBlock(req.params.number);
    res.send(block);
});

app.get('/transaction/:hash', async (req, res) => {
    const transaction = await web3.eth.getTransaction(req.params.hash);
    res.send(transaction);
});

app.listen(3000, () => {
    console.log('Example app listening on port 3000!');
});


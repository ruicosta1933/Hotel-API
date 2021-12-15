const express = require ('express');
let QuartosAPI = require ('./Server/quartos');
let AuthAPI = require ('./Server/auth');

function initialize(){
    let api = express ();

    api.use('/quartos', QuartosAPI());
    api.use('/auth', AuthAPI());

    return api;
}

module.exports ={
    initialize: initialize,
};
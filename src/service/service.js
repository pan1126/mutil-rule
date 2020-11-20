import React, { Component } from 'react';
import http from './api'

//get
function getList(){
    http.get('/sys/logout').then((response) => {
        if (response.data === "SUCCESS") {
           
        } else {
            
        }
    })
} 

export default {
    getList
}
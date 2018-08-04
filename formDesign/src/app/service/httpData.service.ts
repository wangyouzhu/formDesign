import { Injectable } from '@angular/core';

@Injectable ()
export class HttpDataService {
    Manage_HOST: string;
    Editor_HOST: string;
    API_HOST:string;
    constructor() {
        //const localHost = window.location.host;
        const localHost = '192.168.0.213';
        this.Manage_HOST = 'http://' + localHost + ':20890/';
        this.Editor_HOST = 'http://' + localHost + ':20890/';

              /*
              this.Manage_HOST = 'http://192.168.0.192:20890/';
              this.Editor_HOST = 'http://192.168.0.192:20890/';*/


            /*this.Manage_HOST = 'http://1388w.cn:20890/';
            this.Editor_HOST = 'http://1388w.cn:208902/';*/

    }
}

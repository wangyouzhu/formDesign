import { Injectable } from '@angular/core';

@Injectable ()
export class HttpDataService {
    Datas_HOST: string;
    Datas_EditorAdd: string;
    Manage_HOST: string;
    constructor() {
        const localhost = window.location.host;

         this.Datas_HOST = 'http://1388w.cn:20890/';
        this.Datas_EditorAdd = 'http://1388w.cn/editor/';
        this.Manage_HOST = 'http://1388w.cn:20890/';

        /*this.Datas_HOST = 'http://' + localhost + ':20890/';
        this.Datas_EditorAdd = 'http://' + localhost + '/editor/';
        this.Manage_HOST = 'http://' + localhost + ':20890/';*/
    }
}

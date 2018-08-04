import { Component, OnInit, ElementRef } from '@angular/core';
import { element } from 'protractor';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers, URLSearchParams } from '@angular/http';
import { setInterval, clearInterval } from 'timers';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { HttpDataService } from '../service/http-data.service';
import * as $ from 'jquery';

@Component({
    selector: 'app-data-table',
    templateUrl: './data-table.component.html',
    styleUrls: ['./data-table.component.css']
})

export class DataTableComponent implements OnInit {
    messages = {};
    rows = [];
    selected = [];

    nodeId: number;  // 节点ID
    nodeName: any;  // 节点名称
    selectId: number[] = []; // 修改时选择的Id
    selectGid: number; //  选择的gid

    titles: any[] = []; // 表头数组
    datas: any[] = []; // 解析的字段
    allTitles: any[] = []; // 全部表头数据，要作 隐藏/显示 数据功能的。
    columns: any[] = [];  // 数据表渲染的表头字段

    /* Search - 搜索 */
    searchTarget = 'all';  // 要搜索的字段

    headers = new Headers({ 'Content-Type': 'application/json; charset=UTF-8' });
    options = new RequestOptions({ headers: this.headers });

    ngOnInit() {
        this.messages = {
            emptyMessage: '您好，可显示的数据为空！',
            totalMessage: '条数据'
        };
    }

    constructor(private http: Http, private el: ElementRef, private router: Router, private httpData: HttpDataService) {

    }

    public fetch(cb) {
        /*
         * 查询数据
         *
         */
        const url = this.httpData.Datas_HOST + 'pageDesignOperatorFacade/selectFormRecord';
        this.http.post(url, {
            'node_id': this.nodeId,
            'classname': this.nodeName,
            'method': 'selectList'
        }, this.options)
        .map(res => res.json())
        .subscribe(data => {
            cb(data);
        });
    }

    public onSelect({ selected }) {
        /*
         * 选择数据
         *
         */
        this.selectId = [];
        selected.forEach((value: any, index: number, obj: any[]) => {
            this.selectId.push(value.id);
        });
        this.selectGid = selected[0].gid;
        console.log(`选择的Id：${this.selectId}`);
        console.log('Select Event', selected);
    }

    private getKeys(item) {
        return Object.keys(item);
    }

    private sorts(array: any[]) {
        /*
         * 排序
         *
         */
        array.sort((x: string, y: string): number => {
            const tmpX = parseInt(x.split('data')[1], 0);
            const tmpY = parseInt(y.split('data')[1], 0);
            if (tmpX > tmpY) {
                return 1;
            } else {
                return -1;
            }
        });
    }

    public queryRecord(nodeId: number, nodeName: string) {
        /*
         * 查询所有数据
         *
         */
        this.nodeId = nodeId;
        this.nodeName = nodeName;
        this.fetch((data) => {
            if (data.status !== '2') {
                this.selected = [];  // 重新查询的时候清除 已点击选择的 数组
                this.rows = data['msg'].data;
                this.titles = data['msg'].title;
                this.columns = [];
                this.datas = [];
                if ( data['msg']['data'] !== null ) {
                    Object.keys(data['msg']['data'][0]).forEach((value: any, index: number, obj: any[]) => {
                        // 提取 数据字段 ，要来对应数据
                        if ( value.search(/^data/) === 0 ) {
                            this.datas.push(value);
                        }
                    });
                    this.sorts(this.datas);  // 排序，让data1 - x 能顺序排下去

                    for ( let i = 0; i < data['msg']['data'].length; i++  ) {  // 循环把 带连接的都删除
                        this.datas.forEach((value: any, index: number, obj: any[]) => {
                            if ( data['msg']['data'][i][value] !== null ) {
                                if ( data['msg']['data'][i][value].search(/^http:\/\/1388w.cn:8888\/folder\//) === 0 ) {
                                    data['msg']['data'][i][value] = data['msg']['data'][i][value].split('http://1388w.cn:8888/folder/')[1];
                                }
                            }
                        });
                    }

                    this.datas.push('gid');
                }
                data['msg']['title'].push('关联ID');
                data['msg']['title'].forEach((value: any, index: number, obj: any[]) => {
                    // 循环生成表头
                    this.columns.push(
                        { name: value, prop: this.datas[index] }
                    );
                });
                this.allTitles = this.columns;  // 显示/隐藏数据 功能 需要的。 // 用来循环选项在页面
                if (data['msg']['selected']) {
                    const selectedArr = this.getKeys(data['msg']['selected']);
                    this.sorts(selectedArr);
                    this.columns.forEach((value: any, index: number, obj: any[]) => {
                        if ( data['msg']['selected'][`data${index + 1}`] === 0 ) {
                            this.toggle(value);  // 进来就循环，用户上一次保存的展示数据信息。
                        }
                    });
                }
            } else {
                alert('抱歉，可显示的数据为空！');
                window.location.reload();
            }
        });

    }

    public jumpPreview(method: string, selectId?: number[], selectGid?: number) {
        /*
         * 跳转到预览界面
         *
         */
        let url;
        if ( method === 'addAgain' ) {
            url = `${this.httpData.Datas_EditorAdd}assets/ueditor/formdesign/preview.html?` +
            `id=${this.nodeId}&name=${this.nodeName}&method=${method}&gid=${this.selectGid}`;
        } else if ( method !== 'add' ) {
          //this.Datas_EditorAdd = 'http://' + localhost + '/editor/';
            url = `${this.httpData.Datas_EditorAdd}assets/ueditor/formdesign/preview.html?` +
            `id=${this.nodeId}&name=${this.nodeName}&method=${method}&selectId=${this.selectId}`;
        } else {
            url = `${this.httpData.Datas_EditorAdd}assets/ueditor/formdesign/preview.html?` +
                `id=${this.nodeId}&name=${this.nodeName}&method=${method}`;
        }
        console.log(url);
        //this.openWin(url);
    }

    private openWin(url) {
        /*
         * 新建窗口打开。
         * 监控着窗口有没有关闭，如果窗口关闭就Ajax请求数据刷新。
         */
        const win = window.open(
            url,
            'add',
            'toolbar=no,resizable=yes,location=no,menubar=no,' +
            'width=' + (screen.availWidth - 300) + ',height=' + (screen.availHeight - 200) + ''
        );
        const reloadValue = setInterval(((Xwin) => {
            return () => {
                if (Xwin.closed) {
                    this.queryRecord(this.nodeId, this.nodeName);
                    clearInterval(reloadValue);
                    // window.location.reload();
                }
            };
        })(win), 1000);
    }

    public jumpDel() {
        /*
         * 删除数据
         *
         */
        let method, url;
        const flag = 1;
        const record = this.selectId.toString();
        if ( this.selectId.length > 1 ) {
            method = 'deleteArray';
            url = this.httpData.Datas_HOST + `pageDesignOperatorFacade/${method}`;
        } else {
            method = 'updateDelete';
            url = this.httpData.Datas_HOST + `pageDesignOperatorFacade/deleteFormRecord`;
        }
        this.http.post(url, {
            'record': record,
            'classname': this.nodeName,
            'method': method,
            'flag': flag
        }, this.options)
            .map(res => res.json())
            .subscribe(data => {
                alert(data.statusMsg);
                this.queryRecord(this.nodeId, this.nodeName);
            });
    }

    public jumpChange() {
        /*
         * 修改数据
         *
         */
        if ( this.selectId.length > 1 ) {
            alert('抱歉，不支持同时修改多条数据！');
        } else if ( this.selectId.length < 1 ) {
            alert('出错！请选择一条数据！');
        } else {
            this.jumpPreview('change', this.selectId);
        }
    }

    public jumpAdd() {
        /*
         * 添加数据
         *
         */
        this.jumpPreview('add');
    }

    public jumpWatch() {
        /*
         * 查看数据
         *
         */
        if ( this.selectId.length > 1 ) {
            alert('抱歉，不支持同时查看多条数据！');
        } else if ( this.selectId.length < 1 ) {
            alert('出错！请选择一条数据！');
        } else {
            this.jumpPreview('watch', this.selectId);
        }
    }

    public jumpAddAgain() {
        /*
         * 再次添加数据
         *
         */
        if ( this.selectId.length > 1 ) {
            alert('抱歉，不支持同时添加多条数据！');
        } else if (this.selectId.length < 1) {
            alert('出错！请选择一条数据！');
        } else {
            this.jumpPreview('addAgain', [] , this.selectGid);
        }
    }

    public search(e): void {
        /*
         * 搜索数据
         *
         * Problems: 现在搜索是 每键入一次就请求一次。 之后要优化这方面，减少请求次数。
         * 未完成 ↑
         */
        let data;  // 参数
        const searchValue = e.target.value;  // 搜索的值
        const searchKey = this.searchTarget; // 要搜索的对象
        if (searchKey === 'all') {
            data = {
                'searchAllKey': `%${searchValue}%`,
                'classname': this.nodeName,
                'method': 'searchAllKey'
            };
        } else {
            data = {
                'searchKey': searchKey,
                'searchValue': `%${searchValue}%`,
                'classname': this.nodeName,
                'method': 'searchKey'
            };
        }
        this.http.post(this.httpData.Datas_HOST + 'pageDesignOperatorFacade/selectFormRecord', data, this.options)
            .map(res => res.json())
            .subscribe(res => {
                console.log(res);
                this.rows = res.msg.data;
            });
    }

    private print(): void {
        const newWindow = window.open('打印窗口', '_blank');
        const docStr = $('.ngx-datatable').prop('outerHTML');
        const headStr = document.head.innerHTML.concat('<style>@page { size: landscape; }</style>');
        newWindow.document.write(docStr);
        newWindow.document.head.innerHTML = headStr;
        newWindow.document.close();
        newWindow.print();
        newWindow.close();
    }

    private share(): void {

    }

    private download(e): void {
        alert(`“${this.nodeName}” : ${this.nodeId} 节点第${this.selectId}行文件开始下载。`);
    }

    /* 显示/隐藏 数据 */
    private toggle(col) {
        const isChecked = this.isChecked(col);
        if (isChecked) {
            this.columns = this.columns.filter(c => {
                return c.prop !== col.prop;
            });
        } else {
            this.columns = [...this.columns, col];
        }
    }

    private isChecked(col) {
        return this.columns.find(c => {
            return c.prop === col.prop;
        });
    }

    private saveSelect(e) {
        const selectBtn = this.el.nativeElement.querySelectorAll('.selectBtn');
        const selected = {};
        selectBtn.forEach((value, index: number, obj: any[]) => {
            if ( value.checked ) {
                selected[`data${index + 1}`] = 1;
            } else {
                selected[`data${index + 1}`] = 0;
            }
        });

        this.http.post(this.httpData.Datas_HOST + 'pageDesignOperatorFacade/updatePageEditor', {
            selected,
            'id': this.nodeId,
        } , this.options)
            .map(res => res.json())
            .subscribe(res => {
                if ( res.status !== '0' ) {
                    alert('抱歉，保存失败！请重新尝试！');
                }
            });
    }

    /* 显示/隐藏 数据 END */
}

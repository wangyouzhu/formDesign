import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Http, Jsonp, RequestOptions, Headers } from '@angular/http';
import { NodeEvent, TreeModel, RenamableNode, Ng2TreeSettings, NodeMenuItemAction, MenuItemSelectedEvent } from 'ng2-tree';
import { DataTableComponent } from '../data-table/data-table.component';
import 'rxjs/add/operator/map';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { HttpDataService } from '../service/http-data.service';
declare const alertify: any;

const theTree: TreeModel = {

  value: '您好,看到这里..',
  id: 9999,
  settings: {
      cssClasses: {
        expanded: 'fa fa-caret-down',
        collapsed: 'fa fa-caret-right',
        empty: 'fa fa-caret-right disabled',
        leaf: 'fa'
      },
      templates: {
        node: '<i class="fa fa-folder-o"></i>',
        leaf: '<i class="fa fa-file-o"></i>'
      },
      static: true
  },
  children: [
    {value: '就证明了..', id: 9999, children: [
      {value: '你的树节点为空..', id: 9999}
    ]},
    {value: '所以我们显示这个提醒您 :)', id: 9999}
  ]

};

@Component({
  selector: 'app-form-manage',
  templateUrl: './form-manage.component.html',
  styleUrls: ['./form-manage.component.css']
})

export class FormManageComponent implements OnInit {
  public settings: Ng2TreeSettings = {
    rootIsVisible: true
  };

  headers = new Headers({ 'Content-type': 'application/json; charset=UTF-8' });
  options = new RequestOptions({ headers: this.headers });

  node_id: number; // 节点的 Id
  node_name: string;  // 节点的 Name
  node_parentId: number;  // 节点的父 Id
  node_sore: number; // 节点的 排序
  newNode_sore: number; // 节点拖动后的 新排序
  node_level = 1; // 节点的 Level

  nodeMenuItem = [  // 配置 右键 按钮
    { action: NodeMenuItemAction.NewTag, name: '新建文件', cssClass: 'fa fa-file-o' },
    { action: NodeMenuItemAction.NewFolder, name: '新建文件夹', cssClass: 'fa fa-folder-o' },
    { action: NodeMenuItemAction.Rename, name: '重命名', cssClass: 'rename' },
    { action: NodeMenuItemAction.Remove, name: '删除', cssClass: 'remove' },
    { action: NodeMenuItemAction.Custom, name: '配置节点', cssClass: 'fa fa-cog' }
  ];

  control_Url: string;  // 根据不同的树，提供不同的接口。
  dataTableShow = true;

  tree = theTree;
  @ViewChild('treePages') private treePage;
  @ViewChild(DataTableComponent) private dataTable: DataTableComponent;
  constructor(private http: Http, private router: Router, private httpData: HttpDataService) {
    this.router.events
      .filter((event) => event instanceof NavigationStart)
      .subscribe((event: NavigationStart) => {
        if ( event.url.split('/').indexOf('add') === -1 ) {
            this.dataTableShow = true;
            this.dataTable.queryRecord(this.node_id, this.node_name);
        } else {
          this.dataTableShow = false;
        }
        // event.url.split('/').indexOf('add') === -1 ? this.dataTableShow = true : this.dataTableShow = false;
      });
  }

  ngOnInit() {
    this.getTreeNode();
  }

  private ajax (method: string, dataObj?: object, callback?) {
    /*
     * 统一请求的接口
     *
     */
    let url: string,
        data: Object;
        if (method === 'add') {
          url = this.httpData.Manage_HOST + this.control_Url + '/addTreeNode';
          data = {
            'value': this.node_name,
            'node_level': this.node_level,
            'parent_id': this.node_parentId
          };
        } else if (method === 'removed') {
          url = this.httpData.Manage_HOST + this.control_Url + '/deleteTreeNode';
          data = dataObj;
        } else if (method === 'rename' || method === 'updataUrl') {
          url = this.httpData.Manage_HOST + this.control_Url + '/updateTreeNode';
          data = dataObj;
        }

    this.http.post(url, JSON.stringify(data), this.options)
    .map(res => res.json())
    .subscribe((res) => {
      console.log(res);
      if (callback) {
        callback.apply(this);
      }
    });
  }

  private getTreeNode () {
    /*
     * 查询树节点
     *
     * 根据进入的模块不同 显示不同的树节点
     */
    // 子站管理 pid 16 pageDesignQueryFacade/getPageContent
    let url = 'nodeQueryFacade/getTreeNode';
    this.control_Url = 'nodeOperatorFacade';
    if ( window.location.hash !== '' ) {
      if (window.location.hash.split('=')[1] === 'zizhan' ) {
        this.control_Url = 'herdNodeOperatorFacade';
        url = 'herdNodeQueryFacade/getTreeNode';
      }
    }

    this.http.get(this.httpData.Manage_HOST + url)
      .map(res => res.json())
      .subscribe((data) => {
        const nodes = data['msg'];
        this.deleteChild(nodes);
        // 还有三个Settings在后端设置了, 1. 折叠 2. 样式 3. 图标(节点名称前的图标)
        nodes.settings.menuItems = this.nodeMenuItem;
        this.tree = nodes;
      });
  }

  private onMenuItemSelected(e) {
    /*
     * 配置 Custom 的按钮的操作
     * 根据 name 的不一样，执行不同的操作
     */
    switch (e.selectedItem) {
      case '配置节点':
        const url = prompt('请输入您需要配置的Url', 'http://');
        const node = e.node.node;
        node.url = url;
        this.ajax('updataUrl', node);
        break;

      default:
        break;
    }
  }

  private deleteChild(obj: any) {
    /*
     * 用途：区分文件夹和文件
     * 操作：If 节点没有children 删除该字段
     */
      let length;
      obj.length === undefined ? length = 1 : length = obj.length;

      for ( let i = 0; i < length; i++ ) {
        let objChild;
        let isFirstFlag;
        obj[i] === undefined ? objChild = obj.children : objChild = obj[i].children;
        obj[i] === undefined ? isFirstFlag = true : isFirstFlag = false;

        if (objChild.length === 0) {
          isFirstFlag ? delete obj.children : delete obj[i].children;
        } else {
          this.deleteChild(objChild);
        }
      }

  }

  private handleSelected($event) {
    /*
     * 树形点击选择操作
     *
     */
    document.title = `后台数据管理 - ${$event.node.node.value}`;
    this.node_id = $event.node.node.id;
    this.node_name = $event.node.node.value;

    switch (this.node_id) {
      case 794:
        window.open('http://13net.net');
        break;
      default:
        this.jumpLink(this.httpData.Datas_EditorAdd + `assets/ueditor/formdesign/preview.html?` +
          `id=${this.node_id}&name=${this.node_name}&method=add`);
        break;
    }
  }

  private jumpLink(target) {
    /*
     * 仅目前 假数据 跳链接使用
     *
     */
    this.dataTableShow = false;
    this.router.navigate(['/home/add', target]);
  }

  private handleCreated($event) {
    /*
     * 树形新建文件操作
     *
     */
    this.node_parentId = $event.node.parent.node.id;
    this.node_name = $event.node.value;
    this.findLevel($event.node.parent);

    this.ajax('add');

  }

  private handleRemoved($event) {
    /*
     * 树形删除操作
     *
     */
    console.log($event);
    const dataObj = $event.node.node;
    delete dataObj.createTime;
    delete dataObj.settings;

    this.ajax('removed', dataObj);
  }

  private handleRenamed($event) {
    /*
     * 树形重命名操作
     *
     */
    const dataObj = $event.node.node;
    delete dataObj.createTime;
    delete dataObj.settings;

    this.ajax('rename', dataObj, this.getTreeNode());
  }

  private handleMoved($event) {
    /*
     * 树形移动节点操作 - 未测试
     * BUG. 暂时不能跨级拖动，他跨级拖动的时候会执行 remove 然后再 move，询问github作者没果，暂没解决办法
     */
    console.log($event);
    this.node_id = $event.node.node.id;
    this.node_parentId = $event.node.parent.id;
    this.node_sore = $event.node.node.node_sore;
    this.newNode_sore = $event.node.positionInParent;

    this.ajax('moved');
  }

  private findLevel(obj) {

    if (obj.parent === null) {
      this.node_level = this.node_level;
    } else {
      this.node_level++;
      this.findLevel(obj.parent);
    }
  }

}
